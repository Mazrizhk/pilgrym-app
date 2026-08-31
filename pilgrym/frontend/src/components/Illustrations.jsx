import React from 'react';

// Hand-drawn isometric artwork used across the marketing pages. Everything is
// inline SVG so it stays crisp, themable and weightless — no image requests.

const defs = (id) => (
  <defs>
    <linearGradient id={`${id}-top`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#4bb0a6" />
      <stop offset="100%" stopColor="#2f938b" />
    </linearGradient>
    <linearGradient id={`${id}-left`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#1b615d" />
      <stop offset="100%" stopColor="#0d3230" />
    </linearGradient>
    <linearGradient id={`${id}-right`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#227872" />
      <stop offset="100%" stopColor="#154744" />
    </linearGradient>
    <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#f5dc8a" />
      <stop offset="100%" stopColor="#d29a1e" />
    </linearGradient>
    <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#e5b332" stopOpacity="0.45" />
      <stop offset="100%" stopColor="#e5b332" stopOpacity="0" />
    </radialGradient>
  </defs>
);

const Shadow = ({ cx = 100, cy = 178, rx = 62 }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry="12" fill="#0d3230" opacity="0.14" />
);

const Frame = ({ id, children, className = '' }) => (
  <svg viewBox="0 0 200 200" className={className} role="img" aria-hidden="true">
    {defs(id)}
    {children}
  </svg>
);

/* The Kaaba as an isometric cube — the anchor image for the guide pages. */
export const IsoKaaba = ({ className = 'h-40 w-40' }) => (
  <Frame id="kaaba" className={className}>
    <circle cx="100" cy="100" r="95" fill="url(#kaaba-glow)" />
    <Shadow />
    <polygon points="100,30 165,68 100,106 35,68" fill="url(#kaaba-top)" />
    <polygon points="35,68 100,106 100,172 35,134" fill="url(#kaaba-left)" />
    <polygon points="165,68 100,106 100,172 165,134" fill="url(#kaaba-right)" />
    {/* Kiswah gold band wrapping both visible faces */}
    <polygon points="35,92 100,130 100,146 35,108" fill="url(#kaaba-gold)" opacity="0.95" />
    <polygon points="165,92 100,130 100,146 165,108" fill="url(#kaaba-gold)" opacity="0.8" />
    <polygon points="52,110 66,118 66,134 52,126" fill="#f5dc8a" opacity="0.5" />
  </Frame>
);

/* Stacked listing cards — "many packages, one place". */
export const IsoCardStack = ({ className = 'h-40 w-40' }) => (
  <Frame id="stack" className={className}>
    <Shadow cy="176" rx="66" />
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(0 ${-i * 26})`}>
        <polygon points="100,120 168,84 100,48 32,84" fill={i === 2 ? 'url(#stack-gold)' : 'url(#stack-top)'} opacity={1 - i * 0.08} />
        <polygon points="32,84 100,120 100,131 32,95" fill="url(#stack-left)" />
        <polygon points="168,84 100,120 100,131 168,95" fill="url(#stack-right)" />
      </g>
    ))}
    <g opacity="0.85">
      <polygon points="100,48 128,63 100,78 72,63" fill="#0d3230" opacity="0.18" />
    </g>
  </Frame>
);

/* Comparison bars rising out of a plinth — the "compare side by side" idea. */
export const IsoCompare = ({ className = 'h-40 w-40' }) => (
  <Frame id="cmp" className={className}>
    <Shadow cy="174" rx="68" />
    <polygon points="100,150 172,110 100,70 28,110" fill="#d4f1ee" />
    <polygon points="28,110 100,150 100,162 28,122" fill="#a9e3dd" />
    <polygon points="172,110 100,150 100,162 172,122" fill="#78cdc4" />
    {[
      { x: 58, y: 122, h: 34, fill: 'top' },
      { x: 100, y: 146, h: 58, fill: 'gold' },
      { x: 142, y: 122, h: 26, fill: 'right' },
    ].map((bar, i) => (
      <g key={i} transform={`translate(${bar.x - 100} ${bar.y - 146})`}>
        <polygon points={`100,${146 - bar.h} 122,${133 - bar.h} 100,${120 - bar.h} 78,${133 - bar.h}`} fill={`url(#cmp-${bar.fill})`} />
        <polygon points={`78,${133 - bar.h} 100,${146 - bar.h} 100,146 78,133`} fill="url(#cmp-left)" />
        <polygon points={`122,${133 - bar.h} 100,${146 - bar.h} 100,146 122,133`} fill="url(#cmp-right)" />
      </g>
    ))}
  </Frame>
);

/* Extruded shield — verification and trust. */
export const IsoShield = ({ className = 'h-40 w-40' }) => (
  <Frame id="shield" className={className}>
    <circle cx="100" cy="96" r="88" fill="url(#shield-glow)" />
    <Shadow cy="182" rx="50" />
    <path d="M100 168c34-18 48-44 48-78V56l-48-20-48 20v34c0 34 14 60 48 78z" fill="url(#shield-left)" transform="translate(6 6)" opacity="0.55" />
    <path d="M100 168c34-18 48-44 48-78V56l-48-20-48 20v34c0 34 14 60 48 78z" fill="url(#shield-right)" />
    <path d="M100 36l48 20v34c0 12-2 23-5 33-26-14-56-20-86-20-3-10-5-21-5-33V56l48-20z" fill="url(#shield-top)" opacity="0.55" />
    <path d="M78 98l16 17 32-36" stroke="url(#shield-gold)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Frame>
);

/* Isometric phone with a confirmed booking — the final step. */
export const IsoBooking = ({ className = 'h-40 w-40' }) => (
  <Frame id="book" className={className}>
    <Shadow cy="178" rx="56" />
    <polygon points="100,26 158,60 100,164 42,130" fill="url(#book-right)" />
    <polygon points="100,26 158,60 158,70 100,36" fill="url(#book-top)" opacity="0.7" />
    <polygon points="42,130 100,164 100,174 42,140" fill="url(#book-left)" />
    <polygon points="100,44 146,71 100,146 54,119" fill="#eefaf9" />
    {[0, 1, 2].map((i) => (
      <polygon
        key={i}
        points={`70,${94 + i * 14} 116,${67 + i * 14} 122,${71 + i * 14} 76,${98 + i * 14}`}
        fill="#a9e3dd"
      />
    ))}
    <circle cx="100" cy="70" r="13" fill="url(#book-gold)" />
    <path d="M94 70l5 5 9-11" stroke="#0d3230" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Frame>
);

/* Scattered, mismatched flyers — what package hunting feels like today. */
export const IsoChaos = ({ className = 'h-40 w-40' }) => (
  <Frame id="chaos" className={className}>
    <Shadow cy="176" rx="70" />
    {[
      { r: -18, x: 34, y: 46, w: 74, h: 54 },
      { r: 11, x: 88, y: 30, w: 70, h: 50 },
      { r: -6, x: 52, y: 96, w: 82, h: 56 },
    ].map((c, i) => (
      <g key={i} transform={`rotate(${c.r} ${c.x + c.w / 2} ${c.y + c.h / 2})`}>
        <rect x={c.x} y={c.y} width={c.w} height={c.h} rx="7" fill="#ffffff" stroke="#d4f1ee" strokeWidth="2" />
        <rect x={c.x + 9} y={c.y + 11} width={c.w - 30} height="6" rx="3" fill="#a9e3dd" />
        <rect x={c.x + 9} y={c.y + 24} width={c.w - 18} height="5" rx="2.5" fill="#eefaf9" />
        <rect x={c.x + 9} y={c.y + 35} width={c.w - 40} height="5" rx="2.5" fill="#eefaf9" />
      </g>
    ))}
    <circle cx="150" cy="140" r="24" fill="url(#chaos-gold)" />
    <text x="150" y="150" textAnchor="middle" fontSize="30" fontWeight="700" fill="#0d3230">?</text>
  </Frame>
);

/* Rising growth platform — used on the For Agencies page. */
export const IsoGrowth = ({ className = 'h-40 w-40' }) => (
  <Frame id="grow" className={className}>
    <Shadow cy="176" rx="66" />
    <polygon points="100,152 174,110 100,68 26,110" fill="#d4f1ee" />
    <polygon points="26,110 100,152 100,164 26,122" fill="#a9e3dd" />
    <polygon points="174,110 100,152 100,164 174,122" fill="#78cdc4" />
    {[
      { dx: -44, h: 20 },
      { dx: 0, h: 44 },
      { dx: 44, h: 70 },
    ].map((bar, i) => (
      <g key={i} transform={`translate(${bar.dx} ${bar.dx / 1.75})`}>
        <polygon points={`100,${110 - bar.h} 118,${100 - bar.h} 100,${90 - bar.h} 82,${100 - bar.h}`} fill={i === 2 ? 'url(#grow-gold)' : 'url(#grow-top)'} />
        <polygon points={`82,${100 - bar.h} 100,${110 - bar.h} 100,120 82,110`} fill="url(#grow-left)" />
        <polygon points={`118,${100 - bar.h} 100,${110 - bar.h} 100,120 118,110`} fill="url(#grow-right)" />
      </g>
    ))}
    <path d="M52 96 L100 70 L148 30" stroke="url(#grow-gold)" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="7 6" />
  </Frame>
);

/* Passport / documents block — legal preparation on the guide page. */
export const IsoDocs = ({ className = 'h-40 w-40' }) => (
  <Frame id="docs" className={className}>
    <Shadow cy="174" rx="58" />
    <polygon points="100,140 160,105 100,70 40,105" fill="url(#docs-top)" />
    <polygon points="40,105 100,140 100,158 40,123" fill="url(#docs-left)" />
    <polygon points="160,105 100,140 100,158 160,123" fill="url(#docs-right)" />
    <polygon points="100,52 152,82 100,112 48,82" fill="#eefaf9" />
    <polygon points="100,60 138,82 100,104 62,82" fill="url(#docs-gold)" opacity="0.35" />
    <circle cx="100" cy="82" r="11" fill="url(#docs-gold)" />
    <rect x="86" y="94" width="28" height="4" rx="2" fill="#227872" transform="rotate(-30 100 96)" />
  </Frame>
);

/* Ihram garments folded on a plinth — packing / spiritual prep. */
export const IsoIhram = ({ className = 'h-40 w-40' }) => (
  <Frame id="ihram" className={className}>
    <Shadow cy="174" rx="58" />
    <polygon points="100,146 158,112 100,78 42,112" fill="url(#ihram-top)" />
    <polygon points="42,112 100,146 100,160 42,126" fill="url(#ihram-left)" />
    <polygon points="158,112 100,146 100,160 158,126" fill="url(#ihram-right)" />
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(0 ${-i * 16})`}>
        <polygon points="100,108 146,82 100,56 54,82" fill="#ffffff" />
        <polygon points="54,82 100,108 100,116 54,90" fill="#d4f1ee" />
        <polygon points="146,82 100,108 100,116 146,90" fill="#a9e3dd" />
      </g>
    ))}
  </Frame>
);

/* Circular tawaf path around a small cube — ritual explainer. */
export const IsoTawaf = ({ className = 'h-40 w-40' }) => (
  <Frame id="tawaf" className={className}>
    <circle cx="100" cy="100" r="92" fill="url(#tawaf-glow)" />
    <Shadow cy="168" rx="66" />
    <ellipse cx="100" cy="120" rx="74" ry="38" fill="none" stroke="#78cdc4" strokeWidth="3" strokeDasharray="8 7" />
    <ellipse cx="100" cy="120" rx="50" ry="26" fill="none" stroke="url(#tawaf-gold)" strokeWidth="3" />
    <polygon points="100,74 132,92 100,110 68,92" fill="url(#tawaf-top)" />
    <polygon points="68,92 100,110 100,142 68,124" fill="url(#tawaf-left)" />
    <polygon points="132,92 100,110 100,142 132,124" fill="url(#tawaf-right)" />
    <polygon points="68,104 100,122 100,130 68,112" fill="url(#tawaf-gold)" />
    <polygon points="132,104 100,122 100,130 132,112" fill="url(#tawaf-gold)" opacity="0.8" />
    {[[38, 128], [162, 112], [126, 152]].map(([cx, cy], i) => (
      <circle key={i} cx={cx} cy={cy} r="5" fill="#154744" opacity="0.55" />
    ))}
  </Frame>
);
