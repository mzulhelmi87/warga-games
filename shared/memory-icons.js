// Memori card pictures: UiTM campus life, as inline SVG so they look the same on every phone
// (emoji fonts differ between iOS, Android and Samsung). A polished flat icon style: two-tone
// shading, a darker outline of the same hue, small highlights and a soft ground shadow. Each
// picture has its own shape and colour so pairs are easy to remember. 48×48, for a white card.
const svg = (body) => `<svg viewBox="0 0 48 48" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
const shadow = (rx = 13, cy = 43) => `<ellipse cx="24" cy="${cy}" rx="${rx}" ry="2.2" fill="#1f1235" opacity=".09"/>`;

export const MEMORY_ICONS = [
  { name: 'Topi graduasi', svg: svg(shadow(12, 41)
    + '<path d="M14 22v7.5c0 3.5 4.5 5.5 10 5.5s10-2 10-5.5V22" fill="#5f3dc4"/><path d="M24 35c5.5 0 10-2 10-5.5V22l-10 4.5z" fill="#4c2fb0"/><path d="M14 22v7.5c0 3.5 4.5 5.5 10 5.5s10-2 10-5.5V22" fill="none" stroke="#3b2289" stroke-width="1.6"/>'
    + '<path d="M6 17.5l18 8 18-8v2.2l-18 8-18-8z" fill="#3b2289"/><path d="M24 9.5l18 8-18 8-18-8z" fill="#7950f2" stroke="#3b2289" stroke-width="1.6"/><path d="M11.5 17.3l12.5-5.6" stroke="#fff" stroke-width="1.4" opacity=".35"/>'
    + '<path d="M24 17.5l12.5 4.5v9" fill="none" stroke="#fab005" stroke-width="2"/><circle cx="24" cy="17.5" r="1.7" fill="#fcc419" stroke="#e67700" stroke-width="1"/><path d="M34.6 31h3.8l.9 5h-5.6z" fill="#fcc419" stroke="#e67700" stroke-width="1.2"/>') },
  { name: 'Skrol ijazah', svg: svg(shadow(15, 41)
    + '<rect x="10" y="16" width="28" height="16" rx="2" fill="#fff3bf"/><rect x="10" y="27.5" width="28" height="4.5" fill="#ffe8a3"/><rect x="10" y="16" width="28" height="16" rx="2" fill="none" stroke="#b08a1e" stroke-width="1.6"/>'
    + '<ellipse cx="10" cy="24" rx="3.5" ry="8" fill="#ffec99" stroke="#b08a1e" stroke-width="1.6"/><ellipse cx="10" cy="24" rx="1.3" ry="3.4" fill="none" stroke="#b08a1e" stroke-width="1.1"/><ellipse cx="38" cy="24" rx="3.5" ry="8" fill="#ffec99" stroke="#b08a1e" stroke-width="1.6"/><ellipse cx="38" cy="24" rx="1.3" ry="3.4" fill="none" stroke="#b08a1e" stroke-width="1.1"/>'
    + '<path d="M16 20.5h9M16 24h9M16 27.5h5.5" stroke="#d9b44a" stroke-width="1.5"/>'
    + '<path d="M28.6 29.5l-2.4 8 3-1.4 1.6 2.5.8-7.6z" fill="#c92a2a"/><path d="M33.4 29.5l2.4 8-3-1.4-1.6 2.5-.8-7.6z" fill="#e03131"/><circle cx="31" cy="27.5" r="5" fill="#e03131" stroke="#a51d1d" stroke-width="1.4"/><circle cx="31" cy="27.5" r="2.6" fill="none" stroke="#ffc9c9" stroke-width="1.2"/>') },
  { name: 'Buku', svg: svg(shadow(13, 42.5)
    + '<path d="M13 36h23.5v4.5H15.5a2.5 2.5 0 0 1-2.5-2.5z" fill="#fff" stroke="#1864ab" stroke-width="1.4"/><path d="M16.5 38.3h18" stroke="#ced4da" stroke-width="1"/>'
    + '<rect x="11" y="7.5" width="26" height="30" rx="3" fill="#228be6" stroke="#1864ab" stroke-width="1.6"/><rect x="11" y="7.5" width="6" height="30" rx="2.5" fill="#1971c2" stroke="#1864ab" stroke-width="1.6"/><path d="M20 10.5v24" stroke="#fff" stroke-width="1.2" opacity=".25"/>'
    + '<rect x="20.5" y="19" width="13" height="6" rx="1.5" fill="#fff"/><path d="M22.5 30h9M22.5 33.2h6" stroke="#a5d8ff" stroke-width="1.6"/><path d="M29.5 7.5v8.5l2.5-2 2.5 2V7.5" fill="#fa5252" stroke="#c92a2a" stroke-width="1.2"/>') },
  { name: 'Beg galas', svg: svg(shadow(12, 42.5)
    + '<path d="M20 9.5c0-3.2 8-3.2 8 0" fill="none" stroke="#a61e1e" stroke-width="2.6"/>'
    + '<path d="M13 18c0-6 5-9 11-9s11 3 11 9v17c0 3-2 5-5 5H18c-3 0-5-2-5-5z" fill="#fa5252"/><path d="M29 10.2c3.6 1.2 6 3.9 6 7.8v17c0 3-2 5-5 5h-1z" fill="#e03131"/><path d="M13 18c0-6 5-9 11-9s11 3 11 9v17c0 3-2 5-5 5H18c-3 0-5-2-5-5z" fill="none" stroke="#a61e1e" stroke-width="1.6"/>'
    + '<path d="M13.4 19.5h21.2" stroke="#a61e1e" stroke-width="1.4"/><path d="M16.5 15.5v15" stroke="#fff" stroke-width="1.4" opacity=".3"/>'
    + '<rect x="17" y="25.5" width="14" height="11" rx="3" fill="#ff8787" stroke="#a61e1e" stroke-width="1.4"/><path d="M20 29h8" stroke="#a61e1e" stroke-width="1.4"/><rect x="26.4" y="29" width="2.2" height="3.6" rx="1" fill="#fcc419" stroke="#a61e1e" stroke-width=".8"/>') },
  { name: 'Komputer riba', svg: svg(shadow(17, 41.5)
    + '<rect x="10" y="8.5" width="28" height="21.5" rx="2.5" fill="#343a40" stroke="#212529" stroke-width="1.6"/><rect x="12.5" y="11" width="23" height="16.5" rx="1.2" fill="#e7f5ff"/><path d="M13.7 11h20.6a1.2 1.2 0 0 1 1.2 1.2v2.3h-23v-2.3a1.2 1.2 0 0 1 1.2-1.2z" fill="#4dabf7"/>'
    + '<path d="M15.5 18.5h10M15.5 21.5h14M15.5 24.5h7" stroke="#74c0fc" stroke-width="1.6"/><path d="M28 11h5l-8 16.5h-5z" fill="#fff" opacity=".35"/>'
    + '<path d="M5.5 31.5h37l-1.6 5.2c-.4 1.1-1.4 1.8-2.5 1.8H9.6c-1.1 0-2.1-.7-2.5-1.8z" fill="#dee2e6" stroke="#868e96" stroke-width="1.6"/><path d="M7.3 35h33.4" stroke="#adb5bd" stroke-width="1.2"/><rect x="20" y="32.4" width="8" height="1.6" rx=".8" fill="#adb5bd"/>') },
  { name: 'Pensel', svg: svg(shadow(14, 41)
    + '<g transform="rotate(-35 24 24)"><rect x="12" y="18.5" width="22" height="11" rx="1" fill="#fcc419"/><rect x="12" y="24" width="22" height="5.5" fill="#f59f00"/><rect x="12" y="18.5" width="22" height="11" rx="1" fill="none" stroke="#c76b00" stroke-width="1.6"/><path d="M13 21.3h20" stroke="#fff" stroke-width="1.2" opacity=".4"/>'
    + '<rect x="4.5" y="18.5" width="5.5" height="11" rx="2.2" fill="#f783ac" stroke="#c2255c" stroke-width="1.6"/><rect x="9.5" y="18.5" width="3.5" height="11" fill="#ced4da" stroke="#868e96" stroke-width="1.2"/><path d="M11.2 18.5v11" stroke="#868e96" stroke-width=".9"/>'
    + '<path d="M34 18.5l8.5 5.5-8.5 5.5z" fill="#ffe8cc"/><path d="M34 24h8.5L34 29.5z" fill="#f4c79a"/><path d="M34 18.5l8.5 5.5-8.5 5.5z" fill="none" stroke="#a9692f" stroke-width="1.6"/><path d="M39.6 22.2L42.5 24l-2.9 1.8z" fill="#343a40"/></g>') },
  { name: 'Teh tarik', svg: svg(shadow(11, 42.5)
    + '<path d="M19 9.5c-1.5-2 1.5-3 0-5M25 9.5c-1.5-2 1.5-3 0-5" fill="none" stroke="#ced4da" stroke-width="1.8"/><path d="M32 20h3c2.5 0 4 2 4 4.5S37.5 29 35 29h-4" fill="none" stroke="#8a5a2b" stroke-width="2.6"/>'
    + '<path d="M11.5 15.5h21l-2 21.5c-.3 2-2 3.5-4 3.5h-9c-2 0-3.7-1.5-4-3.5z" fill="#d9a066"/><path d="M12.6 27.5h18.8l-.9 9.5c-.2 1.6-1.5 2.8-3.1 2.8h-9.8c-1.6 0-2.9-1.2-3.1-2.8z" fill="#b8763d"/><path d="M11.5 15.5h21l-2 21.5c-.3 2-2 3.5-4 3.5h-9c-2 0-3.7-1.5-4-3.5z" fill="none" stroke="#8a5a2b" stroke-width="1.6"/>'
    + '<path d="M15 19.5l1.2 16" stroke="#fff" stroke-width="1.6" opacity=".45"/><ellipse cx="22" cy="15.5" rx="10.5" ry="3" fill="#fff8ef" stroke="#c9a57a" stroke-width="1.4"/><circle cx="18" cy="15.3" r=".9" fill="#ead2b4"/><circle cx="25" cy="16" r="1.1" fill="#ead2b4"/><circle cx="28.3" cy="14.9" r=".7" fill="#ead2b4"/>') },
  { name: 'Bas kampus', svg: svg(shadow(15, 42)
    + '<rect x="13" y="35" width="6" height="6" rx="2" fill="#343a40"/><rect x="29" y="35" width="6" height="6" rx="2" fill="#343a40"/><path d="M10 15H7.5v5M38 15h2.5v5" fill="none" stroke="#2b8a3e" stroke-width="1.8"/>'
    + '<rect x="10" y="8.5" width="28" height="29" rx="5" fill="#40c057"/><path d="M10 29.5h28v3a5 5 0 0 1-5 5H15a5 5 0 0 1-5-5z" fill="#37b24d"/><rect x="10" y="8.5" width="28" height="29" rx="5" fill="none" stroke="#2b8a3e" stroke-width="1.6"/>'
    + '<rect x="15" y="10.8" width="18" height="4.4" rx="1.2" fill="#212529"/><text x="24" y="14.3" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="3.8" fill="#ffd43b">UiTM</text>'
    + '<rect x="13" y="17" width="22" height="10" rx="2" fill="#e6fcf5" stroke="#2b8a3e" stroke-width="1.4"/><path d="M24 17v10" stroke="#2b8a3e" stroke-width="1.4"/><path d="M16 26l4-8h2.5l-4 8z" fill="#fff" opacity=".7"/>'
    + '<circle cx="16" cy="31.5" r="2.2" fill="#ffe066" stroke="#e67700" stroke-width="1"/><circle cx="32" cy="31.5" r="2.2" fill="#ffe066" stroke="#e67700" stroke-width="1"/><path d="M21 31.5h6" stroke="#2b8a3e" stroke-width="1.6"/>') },
  { name: 'Kad matrik', svg: svg(shadow(12, 44)
    + '<path d="M18 14l3-10M30 14l-3-10" fill="none" stroke="#c2255c" stroke-width="2.4"/>'
    + '<rect x="11.5" y="13.5" width="25" height="29" rx="3" fill="#fff"/><path d="M11.5 16.5a3 3 0 0 1 3-3h19a3 3 0 0 1 3 3V20h-25z" fill="#e64980"/><rect x="11.5" y="13.5" width="25" height="29" rx="3" fill="none" stroke="#a61e4d" stroke-width="1.6"/>'
    + '<rect x="20.5" y="11" width="7" height="5" rx="1.5" fill="#ced4da" stroke="#868e96" stroke-width="1"/>'
    + '<rect x="15.5" y="23" width="10" height="11" rx="1.5" fill="#fcc2d7"/><circle cx="20.5" cy="27" r="2.4" fill="#e64980"/><path d="M16.6 34c.5-2.8 2-4.2 3.9-4.2s3.4 1.4 3.9 4.2z" fill="#e64980"/>'
    + '<path d="M29 25h4.5M29 28.5h4.5M29 32h3" stroke="#adb5bd" stroke-width="1.6"/><path d="M16 37v3M18 37v3M19.5 37v3M22 37v3M24 37v3M25.5 37v3M28 37v3M30 37v3M32 37v3" stroke="#495057" stroke-width=".9"/>') },
  { name: 'Kelalang makmal', svg: svg(shadow(13, 42.5)
    + '<path d="M20 9h8v8.5l9 17c1.5 3-.5 6-4 6H15c-3.5 0-5.5-3-4-6l9-17z" fill="#f8f9fa"/><path d="M14.3 30.5h19.4l2 3.9c.9 1.9-.4 3.6-2.4 3.6H14.7c-2 0-3.3-1.7-2.4-3.6z" fill="#20c997"/><path d="M14.3 30.5h19.4l.9 1.8H13.4z" fill="#63e6be"/>'
    + '<path d="M20 9h8v8.5l9 17c1.5 3-.5 6-4 6H15c-3.5 0-5.5-3-4-6l9-17z" fill="none" stroke="#087f5b" stroke-width="1.6"/><path d="M20 21.5h3M18.3 25h3" stroke="#087f5b" stroke-width="1.4"/><path d="M15.8 33.5l-1.2 2.4" stroke="#fff" stroke-width="1.6" opacity=".6"/>'
    + '<rect x="18.5" y="6" width="11" height="3.5" rx="1.5" fill="#12b886" stroke="#087f5b" stroke-width="1.2"/><circle cx="27" cy="26.5" r="1.4" fill="none" stroke="#20c997" stroke-width="1.1"/><circle cx="25.5" cy="22" r=".9" fill="none" stroke="#20c997" stroke-width="1"/>') },
  { name: 'Piala', svg: svg(shadow(12, 42.5)
    + '<path d="M15 12h-3.5c0 5.5 2 7.5 4.5 7.5M33 12h3.5c0 5.5-2 7.5-4.5 7.5" fill="none" stroke="#c2410c" stroke-width="2.4"/><rect x="21.5" y="25" width="5" height="8" fill="#e8590c"/>'
    + '<rect x="17" y="32" width="14" height="3.4" rx="1" fill="#ff922b" stroke="#c2410c" stroke-width="1.4"/><rect x="14" y="35" width="20" height="5.5" rx="1.5" fill="#f76707" stroke="#c2410c" stroke-width="1.6"/><path d="M20 37.8h8" stroke="#ffd8a8" stroke-width="1.4"/>'
    + '<path d="M15 8.5h18v8.5c0 6-4 10-9 10s-9-4-9-10z" fill="#ff922b"/><path d="M24 27c5 0 9-4 9-10V8.5h-9z" fill="#f76707"/><path d="M15 8.5h18v8.5c0 6-4 10-9 10s-9-4-9-10z" fill="none" stroke="#c2410c" stroke-width="1.6"/>'
    + '<path d="M18 11.5v6" stroke="#fff" stroke-width="1.6" opacity=".5"/><polygon points="24,11.5 25.6,15 29.3,15.3 26.5,17.7 27.4,21.3 24,19.4 20.6,21.3 21.5,17.7 18.7,15.3 22.4,15" fill="#fff3bf" stroke="#fff3bf" stroke-width=".8"/>') },
  { name: 'Jam loceng', svg: svg(shadow(13, 43.5)
    + '<path d="M15 38.5l-3 4M33 38.5l3 4" stroke="#3b5bdb" stroke-width="2.6"/><path d="M24 12V9" stroke="#3b5bdb" stroke-width="2"/><rect x="21" y="6.5" width="6" height="2.6" rx="1.3" fill="#748ffc" stroke="#3b5bdb" stroke-width="1"/>'
    + '<circle cx="14" cy="12" r="5" fill="#748ffc" stroke="#3b5bdb" stroke-width="1.6"/><circle cx="34" cy="12" r="5" fill="#748ffc" stroke="#3b5bdb" stroke-width="1.6"/>'
    + '<circle cx="24" cy="26" r="14" fill="#5c7cfa" stroke="#3b5bdb" stroke-width="1.6"/><path d="M12.5 21.8A12.2 12.2 0 0 1 18.8 14.9" fill="none" stroke="#fff" stroke-width="1.6" opacity=".45"/><circle cx="24" cy="26" r="10.5" fill="#fff" stroke="#3b5bdb" stroke-width="1"/>'
    + '<path d="M24 18.1V16.5M28.3 18.6L28.8 17.8M31.4 21.7L32.2 21.2M31.9 26H33.5M31.4 30.3L32.2 30.8M28.3 33.4L28.8 34.2M24 33.9V35.5M19.7 33.4L19.2 34.2M16.6 30.3L15.8 30.8M16.1 26H14.5M16.6 21.7L15.8 21.2M19.7 18.6L19.2 17.8" stroke="#91a7ff" stroke-width="1.2"/>'
    + '<path d="M24 26v-6.5M24 26l-5.2 3" stroke="#364fc7" stroke-width="2"/><circle cx="24" cy="26" r="1.4" fill="#364fc7"/>') },
];
