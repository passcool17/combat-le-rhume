// Icônes (tracés identiques à ceux de l’appli d’origine, style Lucide).
import { createElement } from "react";

function icone(nom, noeuds) {
  const Icone = ({ className = "", ...props }) =>
    createElement(
      "svg",
      { xmlns: "http://www.w3.org/2000/svg", width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: ["lucide", "lucide-" + nom, className].filter(Boolean).join(" "), ...props },
      noeuds.map(([tag, { key, ...attrs }]) => createElement(tag, { key, ...attrs })),
    );
  Icone.displayName = nom;
  return Icone;
}

export const BookOpen = icone("book-open", [["path",{"d":"M12 7v14","key":"1akyts"}],["path",{"d":"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z","key":"ruj8y"}]]);
export const Check = icone("check", [["path",{"d":"M20 6 9 17l-5-5","key":"1gmf2c"}]]);
export const ClipboardList = icone("clipboard-list", [["rect",{"width":"8","height":"4","x":"8","y":"2","rx":"1","ry":"1","key":"tgr4d6"}],["path",{"d":"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2","key":"116196"}],["path",{"d":"M12 11h4","key":"1jrz19"}],["path",{"d":"M12 16h4","key":"n85exb"}],["path",{"d":"M8 11h.01","key":"1dfujw"}],["path",{"d":"M8 16h.01","key":"18s6g9"}]]);
export const House = icone("house", [["path",{"d":"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8","key":"5wwlr5"}],["path",{"d":"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z","key":"1d0kgt"}]]);
export const Leaf = icone("leaf", [["path",{"d":"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z","key":"nnexq3"}],["path",{"d":"M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12","key":"mt58a7"}]]);
export const Moon = icone("moon", [["path",{"d":"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z","key":"a7tn18"}]]);
export const Search = icone("search", [["path",{"d":"m21 21-4.34-4.34","key":"14j7rj"}],["circle",{"cx":"11","cy":"11","r":"8","key":"4ej97u"}]]);
export const Sprout = icone("sprout", [["path",{"d":"M7 20h10","key":"e6iznv"}],["path",{"d":"M10 20c5.5-2.5.8-6.4 3-10","key":"161w41"}],["path",{"d":"M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z","key":"9gtqwd"}],["path",{"d":"M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z","key":"bkxnd2"}]]);
export const Star = icone("star", [["path",{"d":"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z","key":"r04s7s"}]]);
export const Stethoscope = icone("stethoscope", [["path",{"d":"M11 2v2","key":"1539x4"}],["path",{"d":"M5 2v2","key":"1yf1q8"}],["path",{"d":"M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1","key":"rb5t3r"}],["path",{"d":"M8 15a6 6 0 0 0 12 0v-3","key":"x18d4x"}],["circle",{"cx":"20","cy":"10","r":"2","key":"ts1r5v"}]]);
export const Sun = icone("sun", [["circle",{"cx":"12","cy":"12","r":"4","key":"4exip2"}],["path",{"d":"M12 2v2","key":"tus03m"}],["path",{"d":"M12 20v2","key":"1lh1kg"}],["path",{"d":"m4.93 4.93 1.41 1.41","key":"149t6j"}],["path",{"d":"m17.66 17.66 1.41 1.41","key":"ptbguv"}],["path",{"d":"M2 12h2","key":"1t8f8n"}],["path",{"d":"M20 12h2","key":"1q8mjw"}],["path",{"d":"m6.34 17.66-1.41 1.41","key":"1m8zz5"}],["path",{"d":"m19.07 4.93-1.41 1.41","key":"1shlcs"}]]);
export const Trash2 = icone("trash-2", [["path",{"d":"M3 6h18","key":"d0wm0j"}],["path",{"d":"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6","key":"4alrt4"}],["path",{"d":"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2","key":"v07s0e"}],["line",{"x1":"10","x2":"10","y1":"11","y2":"17","key":"1uufr5"}],["line",{"x1":"14","x2":"14","y1":"11","y2":"17","key":"xtxkd"}]]);
