import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import ZoomModal from '../components/ZoomModal';

export default function ReaderPage() {
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [spreadStart, setSpreadStart] = useState(1);
  const [isFS, setIsFS] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [zoomPageNum, setZoomPageNum] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);
  const spreadWrapperRef = useRef<HTMLDivElement>(null);
  const bookSpreadRef = useRef<HTMLDivElement>(null);

  const computeScale = async () => {
    if (!pdfDoc || !spreadWrapperRef.current) return 1.4;
    const wrapW = spreadWrapperRef.current.clientWidth;
    const wrapH = spreadWrapperRef.current.clientHeight;
    const gap = 3;
    const padding = isFS ? 20 : 32;
    const vertPad = isFS ? 20 : 30;
    const availW = wrapW - gap - padding;
    const availH = wrapH - vertPad;
    if (availW <= 0 || availH <= 0) return 1.4;
    const page = await pdfDoc.getPage(1);
    const vp = page.getViewport({ scale: 1 });
    const scaleW = availW / (2 * vp.width);
    const scaleH = availH / vp.height;
    return Math.min(Math.max(0.5, Math.min(scaleW, scaleH)), 3.0);
  };

  const renderSpread = useCallback(async () => {
    if (!pdfDoc || !leftCanvasRef.current || !rightCanvasRef.current || isRendering) return;
    setIsRendering(true);
    setLoadingProgress(20);
    try {
      const scale = await computeScale();
      const leftPage = await pdfDoc.getPage(spreadStart);
      const rightPageNum = spreadStart + 1;
      const rightPage = rightPageNum <= totalPages ? await pdfDoc.getPage(rightPageNum) : null;
      const lvp = leftPage.getViewport({ scale });
      const leftCanvas = leftCanvasRef.current;
      leftCanvas.width = lvp.width;
      leftCanvas.height = lvp.height;
      const leftCtx = leftCanvas.getContext('2d');
      if (leftCtx) {
        await leftPage.render({ canvasContext: leftCtx, viewport: lvp, canvas: leftCanvas } as any).promise;
      }
      const rightCanvas = rightCanvasRef.current;
      const rightCtx = rightCanvas.getContext('2d');
      if (rightCtx) {
        if (rightPage) {
          const rvp = rightPage.getViewport({ scale });
          rightCanvas.width = rvp.width;
          rightCanvas.height = rvp.height;
          rightCtx.clearRect(0, 0, rightCanvas.width, rightCanvas.height);
          await rightPage.render({ canvasContext: rightCtx, viewport: rvp, canvas: rightCanvas } as any).promise;
          if (rightCanvas.parentElement) rightCanvas.parentElement.style.opacity = '1';
        } else {
          rightCanvas.width = leftCanvas.width;
          rightCanvas.height = leftCanvas.height;
          rightCtx.clearRect(0, 0, rightCanvas.width, rightCanvas.height);
          rightCtx.fillStyle = '#f7f4f0';
          rightCtx.fillRect(0, 0, rightCanvas.width, rightCanvas.height);
          if (rightCanvas.parentElement) rightCanvas.parentElement.style.opacity = '0.4';
        }
      }
    } catch (e) {
      console.error(e);
    }
    setLoadingProgress(0);
    setIsRendering(false);
  }, [pdfDoc, spreadStart, totalPages, isFS]);

  useEffect(() => { renderSpread(); }, [renderSpread]);

  useEffect(() => {
    let timer: number;
    const handleResize = () => {
      if (!pdfDoc) return;
      clearTimeout(timer);
      timer = window.setTimeout(renderSpread, 200);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderSpread, pdfDoc]);

  useEffect(() => {
    const onFSChange = () => {
      const fsElem = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
      setIsFS(fsElem);
      document.getElementById('root')?.classList.toggle('is-fullscreen', fsElem);
    };
    document.addEventListener('fullscreenchange', onFSChange);
    document.addEventListener('webkitfullscreenchange', onFSChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFSChange);
      document.removeEventListener('webkitfullscreenchange', onFSChange);
    };
  }, []);

  const toggleFS = () => {
    const root = document.getElementById('root');
    if (!root) return;
    if (!document.fullscreenElement) {
      root.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const loadPDF = (bytes: Uint8Array) => {
    setLoadingProgress(30);
    pdfjsLib.getDocument({ data: bytes }).promise
      .then(pdf => {
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setSpreadStart(1);
        setLoadingProgress(80);
      })
      .catch(err => {
        console.error(err);
        setLoadingProgress(0);
        alert('Could not load PDF. Please try another file.');
      });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') return;
    const fr = new FileReader();
    fr.onload = ev => {
      if (ev.target?.result) {
        loadPDF(new Uint8Array(ev.target.result as ArrayBuffer));
      }
    };
    fr.readAsArrayBuffer(file);
  };

  const goNext = useCallback(() => {
    if (!pdfDoc) return;
    if (spreadStart + 2 <= totalPages) {
      setSpreadStart(prev => prev + 2);
    } else if (bookSpreadRef.current) {
      bookSpreadRef.current.style.transform = 'translateX(6px)';
      setTimeout(() => bookSpreadRef.current && (bookSpreadRef.current.style.transform = ''), 150);
    }
  }, [pdfDoc, spreadStart, totalPages]);

  const goPrev = useCallback(() => {
    if (!pdfDoc) return;
    if (spreadStart - 2 >= 1) {
      setSpreadStart(prev => prev - 2);
    } else if (spreadStart > 1) {
      setSpreadStart(1);
    } else if (bookSpreadRef.current) {
      bookSpreadRef.current.style.transform = 'translateX(-6px)';
      setTimeout(() => bookSpreadRef.current && (bookSpreadRef.current.style.transform = ''), 150);
    }
  }, [pdfDoc, spreadStart]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (zoomPageNum !== null) {
        if (e.key === 'Escape') setZoomPageNum(null);
        return;
      }
      switch (e.key) {
        case 'ArrowLeft': case 'ArrowUp': e.preventDefault(); goPrev(); break;
        case 'ArrowRight': case 'ArrowDown': case ' ': e.preventDefault(); goNext(); break;
        case 'f': case 'F': e.preventDefault(); toggleFS(); break;
        case 'Escape': if (isFS) document.exitFullscreen?.(); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomPageNum, isFS, goPrev, goNext]);

  useEffect(() => {
    const onDragEnter = (e: DragEvent) => { e.preventDefault(); setIsDragOver(true); };
    const onDragLeave = (e: DragEvent) => { if (!e.relatedTarget) setIsDragOver(false); };
    const onDragOver = (e: DragEvent) => e.preventDefault();
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer?.files[0];
      if (!file || file.type !== 'application/pdf') return;
      const fr = new FileReader();
      fr.onload = ev => {
        if (ev.target?.result) {
          loadPDF(new Uint8Array(ev.target.result as ArrayBuffer));
        }
      };
      fr.readAsArrayBuffer(file);
    };
    document.addEventListener('dragenter', onDragEnter);
    document.addEventListener('dragleave', onDragLeave);
    document.addEventListener('dragover', onDragOver);
    document.addEventListener('drop', onDrop);
    return () => {
      document.removeEventListener('dragenter', onDragEnter);
      document.removeEventListener('dragleave', onDragLeave);
      document.removeEventListener('dragover', onDragOver);
      document.removeEventListener('drop', onDrop);
    };
  }, []);

  const rightPageNum = spreadStart + 1;
  const rightLabel = rightPageNum > totalPages ? spreadStart : `${spreadStart}–${rightPageNum}`;

  return (
    <>
      <div className={`loading-bar ${loadingProgress > 0 ? 'active' : ''}`} style={{ width: `${loadingProgress}%` }}></div>

      <div className={`drop-overlay ${isDragOver ? 'active' : ''}`}>
        <div className="drop-overlay-text">Drop your PDF</div>
        <div className="drop-overlay-sub">Release to open</div>
      </div>

      {zoomPageNum !== null && pdfDoc && (
        <ZoomModal
          pdfDoc={pdfDoc}
          pageNum={zoomPageNum}
          totalPages={totalPages}
          onClose={() => setZoomPageNum(null)}
        />
      )}

      <header className="top-nav">
        <div className="brand">
          <img src="/logo.png" alt="Logo" className="brand-logo" />
          Flow State
        </div>

        <div className="nav-controls">
          <button className="nav-btn" onClick={goPrev}>
            <svg className="feather" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <div className="page-indicator"><span>{pdfDoc ? rightLabel : '—'}</span> / {pdfDoc ? totalPages : '—'}</div>
          <button className="nav-btn" onClick={goNext}>
            <svg className="feather" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>

        <div className="view-toggles">
          <button className="view-toggle">Single</button>
          <button className="view-toggle active">Dual</button>
          <button className="view-toggle" onClick={toggleFS}>Immersive</button>
          <label className="view-toggle" style={{cursor: 'pointer'}}>
            Open
            <input type="file" accept="application/pdf" style={{ display: 'none' }} onChange={handleFileChange} />
          </label>
        </div>
      </header>

      <div className="reader-area" ref={spreadWrapperRef}>
        <div className="nav-zone left" onClick={goPrev}></div>

        {!pdfDoc && (
          <div className="empty-cta" style={{zIndex: 10}}>
            <div className="empty-cta-icon">
              <svg className="feather" viewBox="0 0 24 24" style={{width: 28, height: 28}} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <div className="empty-cta-text">Open a book to begin</div>
            <div className="empty-cta-sub">Immersive dual-page reading environment</div>
            <label className="empty-cta-drop">
              Browse Files
              <input type="file" accept="application/pdf" style={{ display: 'none' }} onChange={handleFileChange} />
            </label>
          </div>
        )}

        {pdfDoc && (
          <div className="book-spread" ref={bookSpreadRef} style={{ display: 'flex' }}>
            <div className="page-card left">
              <canvas ref={leftCanvasRef} onClick={() => setZoomPageNum(spreadStart)} />
              <div className="page-badge">{spreadStart}</div>
            </div>
            <div className="spine"></div>
            <div className="page-card right">
              <canvas ref={rightCanvasRef} onClick={() => { if (spreadStart + 1 <= totalPages) setZoomPageNum(spreadStart + 1); }} />
              <div className="page-badge">{rightPageNum <= totalPages ? rightPageNum : ''}</div>
            </div>
          </div>
        )}

        <div className="nav-zone right" onClick={goNext}></div>
      </div>
    </>
  );
}
