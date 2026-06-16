import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

interface ZoomModalProps {
  pdfDoc: pdfjsLib.PDFDocumentProxy;
  pageNum: number;
  totalPages: number;
  onClose: () => void;
}

export default function ZoomModal({ pdfDoc, pageNum, totalPages, onClose }: ZoomModalProps) {
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  const state = useRef({
    zoomScale: 1,
    zoomFitScale: 1,
    panX: 0,
    panY: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    panStartX: 0,
    panStartY: 0,
    lastTouchDist: null as number | null,
    cw: 0,
    ch: 0
  });

  const RENDER_SCALE = 3.5;

  const updateTransform = () => {
    if (!wrapRef.current) return;
    const s = state.current;
    wrapRef.current.style.transform = `translate(${s.panX}px, ${s.panY}px) scale(${s.zoomScale})`;
    if (labelRef.current) {
      labelRef.current.textContent = Math.round((s.zoomScale / s.zoomFitScale) * 100) + '%';
    }
  };

  const clampPan = () => {
    if (!viewportRef.current) return;
    const vw = viewportRef.current.clientWidth;
    const vh = viewportRef.current.clientHeight;
    const s = state.current;
    const cw = s.cw * s.zoomScale;
    const ch = s.ch * s.zoomScale;
    const margin = 80;
    const minX = Math.min(margin - cw, (vw - cw) / 2);
    const maxX = Math.max(vw - margin, (vw - cw) / 2);
    const minY = Math.min(margin - ch, (vh - ch) / 2);
    const maxY = Math.max(vh - margin, (vh - ch) / 2);
    s.panX = Math.min(maxX, Math.max(minX, s.panX));
    s.panY = Math.min(maxY, Math.max(minY, s.panY));
  };

  const zoomFit = () => {
    if (!viewportRef.current) return;
    const vw = viewportRef.current.clientWidth;
    const vh = viewportRef.current.clientHeight - 80;
    const s = state.current;
    s.zoomFitScale = Math.min((vw - 40) / s.cw, (vh - 40) / s.ch);
    s.zoomScale = s.zoomFitScale;
    s.panX = (viewportRef.current.clientWidth - s.cw * s.zoomScale) / 2;
    s.panY = (viewportRef.current.clientHeight - s.ch * s.zoomScale) / 2;
    updateTransform();
  };

  const zoomStep = (delta: number, cx?: number, cy?: number) => {
    if (!viewportRef.current) return;
    const vw = viewportRef.current.clientWidth;
    const vh = viewportRef.current.clientHeight;
    const s = state.current;
    cx = cx ?? vw / 2;
    cy = cy ?? vh / 2;

    const minScale = s.zoomFitScale * 0.5;
    const maxScale = s.zoomFitScale * 10;
    const oldScale = s.zoomScale;
    s.zoomScale = Math.min(maxScale, Math.max(minScale, s.zoomScale + delta * s.zoomFitScale));

    s.panX = cx - (cx - s.panX) * (s.zoomScale / oldScale);
    s.panY = cy - (cy - s.panY) * (s.zoomScale / oldScale);
    clampPan();
    updateTransform();
  };

  useEffect(() => {
    let active = true;
    const init = async () => {
      try {
        const page = await pdfDoc.getPage(pageNum);
        if (!active) return;
        const vp = page.getViewport({ scale: RENDER_SCALE });
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = vp.width;
        canvas.height = vp.height;
        state.current.cw = vp.width;
        state.current.ch = vp.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          await page.render({ canvasContext: ctx, viewport: vp, canvas } as any).promise;
        }
        if (!active) return;
        setLoading(false);
        setTimeout(zoomFit, 0);
      } catch (e) {
        console.error(e);
      }
    };
    init();
    return () => { active = false; };
  }, [pdfDoc, pageNum]);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = vp.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const delta = e.deltaY < 0 ? 0.15 : -0.15;
      zoomStep(delta, cx, cy);
    };
    vp.addEventListener('wheel', handleWheel, { passive: false });

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const s = state.current;
      s.isDragging = true;
      s.dragStartX = e.clientX;
      s.dragStartY = e.clientY;
      s.panStartX = s.panX;
      s.panStartY = s.panY;
      vp.classList.add('dragging');
      e.preventDefault();
    };
    vp.addEventListener('mousedown', handleMouseDown);

    const handleMouseMove = (e: MouseEvent) => {
      const s = state.current;
      if (!s.isDragging) return;
      s.panX = s.panStartX + (e.clientX - s.dragStartX);
      s.panY = s.panStartY + (e.clientY - s.dragStartY);
      clampPan();
      updateTransform();
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleMouseUp = () => {
      state.current.isDragging = false;
      vp.classList.remove('dragging');
    };
    window.addEventListener('mouseup', handleMouseUp);

    // Touch events
    const handleTouchStart = (e: TouchEvent) => {
      const s = state.current;
      if (e.touches.length === 2) {
        const t0 = e.touches[0], t1 = e.touches[1];
        s.lastTouchDist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
      } else if (e.touches.length === 1) {
        s.isDragging = true;
        s.dragStartX = e.touches[0].clientX;
        s.dragStartY = e.touches[0].clientY;
        s.panStartX = s.panX;
        s.panStartY = s.panY;
      }
    };
    vp.addEventListener('touchstart', handleTouchStart, { passive: true });

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const s = state.current;
      if (e.touches.length === 2 && s.lastTouchDist) {
        const t0 = e.touches[0], t1 = e.touches[1];
        const newDist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
        const delta = (newDist - s.lastTouchDist) / s.lastTouchDist * s.zoomFitScale;
        const rect = vp.getBoundingClientRect();
        const cx = ((t0.clientX + t1.clientX) / 2) - rect.left;
        const cy = ((t0.clientY + t1.clientY) / 2) - rect.top;
        zoomStep(delta, cx, cy);
        s.lastTouchDist = newDist;
      } else if (e.touches.length === 1 && s.isDragging) {
        s.panX = s.panStartX + (e.touches[0].clientX - s.dragStartX);
        s.panY = s.panStartY + (e.touches[0].clientY - s.dragStartY);
        clampPan();
        updateTransform();
      }
    };
    vp.addEventListener('touchmove', handleTouchMove, { passive: false });

    const handleTouchEnd = () => {
      const s = state.current;
      s.lastTouchDist = null;
      s.isDragging = false;
    };
    vp.addEventListener('touchend', handleTouchEnd);

    return () => {
      vp.removeEventListener('wheel', handleWheel);
      vp.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      vp.removeEventListener('touchstart', handleTouchStart);
      vp.removeEventListener('touchmove', handleTouchMove);
      vp.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div className="zoom-modal open">
      <div 
        className="zoom-viewport" 
        id="zoomViewport" 
        ref={viewportRef}
        onClick={(e) => {
          if (e.target === viewportRef.current) onClose();
        }}
      >
        <div 
          className="zoom-canvas-wrap" 
          id="zoomCanvasWrap" 
          ref={wrapRef}
          style={{ opacity: loading ? 0 : 1 }}
        >
          <canvas id="zoomCanvas" ref={canvasRef}></canvas>
        </div>
      </div>

      <div className={`zoom-loading ${loading ? '' : 'hidden'}`} id="zoomLoading">
        <div className="zoom-spinner"></div>
        <div className="zoom-loading-text">Rendering high resolution…</div>
      </div>

      <div className="zoom-toolbar">
        <span className="zt-page-label">{pageNum}/{totalPages}</span>
        <div className="zt-divider"></div>
        <button className="zt-btn" onClick={() => zoomStep(0.25)} title="Zoom In">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <span className="zt-zoom-label" ref={labelRef}>100%</span>
        <button className="zt-btn" onClick={() => zoomStep(-0.25)} title="Zoom Out">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <div className="zt-divider"></div>
        <button className="zt-btn" onClick={zoomFit} title="Fit to Screen">Fit</button>
        <div className="zt-divider"></div>
        <button className="zt-btn danger" onClick={onClose} title="Close Zoom">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

    </div>
  );
}
