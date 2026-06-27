const fs = require('fs');
let content = fs.readFileSync('/home/pranav-sharma/Flow State/src/pages/SyllabusPage.tsx', 'utf-8');

// 1. Update the generic subject cards hover styles
content = content.replace(
/style={{[\s\S]*?border: '1px solid rgba\(255, 255, 255, 0.2\)',[\s\S]*?borderRadius: '12px',[\s\S]*?padding: '2rem',[\s\S]*?background: 'rgba\(255, 255, 255, 0.03\)',[\s\S]*?backdropFilter: 'blur\(10px\)',[\s\S]*?transition: 'transform 0.2s, background 0.2s',[\s\S]*?cursor: 'pointer',[\s\S]*?textAlign: 'center',[\s\S]*?fontSize: '1.5rem',[\s\S]*?fontWeight: '600'[\s\S]*?}}/g,
`style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderTop: '1px solid rgba(255,255,255,0.25)',
              borderLeft: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '20px',
              padding: '2.5rem',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
              cursor: 'pointer',
              textAlign: 'center',
              fontSize: '1.5rem',
              fontWeight: '700',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 2px 0 rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)';
            }}`
);

// Update GS topics subject cards specifically (it has fontSize 1.25rem, fontWeight 500)
content = content.replace(
/style={{[\s\S]*?border: '1px solid rgba\(255, 255, 255, 0.2\)',[\s\S]*?borderRadius: '12px',[\s\S]*?padding: '2rem',[\s\S]*?background: 'rgba\(255, 255, 255, 0.03\)',[\s\S]*?backdropFilter: 'blur\(10px\)',[\s\S]*?transition: 'transform 0.2s, background 0.2s',[\s\S]*?cursor: 'pointer',[\s\S]*?textAlign: 'center',[\s\S]*?fontSize: '1.25rem',[\s\S]*?fontWeight: '500'[\s\S]*?}}/g,
`style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderTop: '1px solid rgba(255,255,255,0.2)',
                borderLeft: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '16px',
                padding: '2rem',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                cursor: 'pointer',
                textAlign: 'center',
                fontSize: '1.25rem',
                fontWeight: '600'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 100%)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)';
              }}`
);

// 2. Update Stats Dashboard Cards
content = content.replace(
/background: 'rgba\(255, 255, 255, 0.03\)',\s*border: `1px solid rgba\(255, 255, 255, 0.1\)`,\s*borderTop: `3px solid \${stat.color}`,\s*borderRadius: '12px',\s*padding: '1.5rem',\s*textAlign: 'center',\s*display: 'flex',\s*flexDirection: 'column',\s*justifyContent: 'space-between'/g,
`background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
              border: \`1px solid rgba(255, 255, 255, 0.1)\`,
              borderTop: \`3px solid \${stat.color}\`,
              borderRadius: '16px',
              padding: '1.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'`
);

// Add hover effect to the stat card div (we need to inject onMouseOver)
content = content.replace(
/<div key={stat.label} style={{[\s\S]*?}}>/g,
(match) => {
  if (match.includes('backdropFilter: \'blur(20px)\'')) {
    return match.replace('}}>', `}}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
            }}>`);
  }
  return match;
}
);

// 3. Update Syllabus Part Cards
content = content.replace(
/background: 'rgba\(255, 255, 255, 0.03\)',\s*border: '1px solid rgba\(255, 255, 255, 0.1\)',\s*borderRadius: '12px',\s*padding: '2rem',\s*marginBottom: '2rem',\s*backdropFilter: 'blur\(10px\)'/g,
`background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderTop: '1px solid rgba(255,255,255,0.15)',
              borderLeft: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px',
              padding: '2rem',
              marginBottom: '3rem',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'`
);

// 4. Improve the chapter row hover effects and layout
content = content.replace(
/borderBottom: j < part.chapters.length - 1 \? '1px solid rgba\(255,255,255,0.05\)' : 'none',/g,
`borderBottom: j < part.chapters.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    transition: 'background 0.2s',
                    borderRadius: '8px',`
);
content = content.replace(
/<div key={j} style={{([\s\S]*?)}}>/g,
(match, p1) => {
  if (p1.includes('alignItems: \'center\'') && p1.includes('justifyContent: \'space-between\'')) {
    return `<div key={j} style={{${p1}}} 
                     onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                     onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>`;
  }
  return match;
}
);

// Add 3d effect to the checkboxes CSS
content = content.replace(
/border: 2px solid rgba\(255, 255, 255, 0.3\);\s*border-radius: 4px;\s*background-color: transparent;/g,
`border: 1px solid rgba(255, 255, 255, 0.3);
            border-top: 1px solid rgba(255, 255, 255, 0.5);
            border-radius: 6px;
            background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02));
            box-shadow: 0 2px 5px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1);`
);

content = content.replace(
/background-color: #4CAF50;\s*border-color: #4CAF50;/g,
`background: linear-gradient(135deg, #4CAF50, #2E7D32);
            border-color: #4CAF50;
            box-shadow: 0 4px 10px rgba(76, 175, 80, 0.4), inset 0 1px 0 rgba(255,255,255,0.3);
            transform: scale(1.1);`
);

fs.writeFileSync('/home/pranav-sharma/Flow State/src/pages/SyllabusPage.tsx', content);
