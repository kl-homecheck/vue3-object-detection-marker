import { defineComponent as he, ref as _, computed as N, watch as P, onMounted as de, onUnmounted as je, createElementBlock as z, openBlock as B, createElementVNode as V, createCommentVNode as J, withModifiers as ee, toDisplayString as fe, normalizeClass as Ie } from "vue";
async function Qe(a) {
  return new Promise((o, n) => {
    const l = new Image();
    if (l.crossOrigin = "anonymous", l.onload = () => o(l), l.onerror = n, typeof a == "string")
      l.src = a;
    else {
      const h = URL.createObjectURL(a);
      l.src = h, l._objectUrl = h;
    }
  });
}
function Ze(a) {
  a._objectUrl && (URL.revokeObjectURL(a._objectUrl), delete a._objectUrl);
}
function ue(a, o, n, l, h) {
  const f = Math.floor(l / n), v = Math.floor(h / n), p = Math.floor(a / n), M = Math.floor(o / n);
  return {
    row: Math.max(0, Math.min(M, v - 1)),
    col: Math.max(0, Math.min(p, f - 1))
  };
}
function et(a, o, n) {
  return {
    x: o * n,
    y: a * n,
    width: n,
    height: n
  };
}
function $(a, o) {
  return `${a},${o}`;
}
function tt(a) {
  const [o, n] = a.split(",").map(Number);
  return { row: o, col: n };
}
function ot(a, o) {
  const n = o.x - a.x, l = o.y - a.y;
  return Math.sqrt(n * n + l * l);
}
function at(a, o) {
  return a.x >= o.x && a.x <= o.x + o.width && a.y >= o.y && a.y <= o.y + o.height;
}
function lt(a, o, n, l, h) {
  const f = ue(a.x, a.y, n, l, h), v = ue(o.x, o.y, n, l, h), p = Math.min(f.row, v.row), M = Math.max(f.row, v.row), w = Math.min(f.col, v.col), r = Math.max(f.col, v.col), c = [];
  for (let u = p; u <= M; u++)
    for (let m = w; m <= r; m++)
      c.push({ row: u, col: m });
  return c;
}
function nt(a, o) {
  let n;
  return function(...h) {
    const f = () => {
      clearTimeout(n), a(...h);
    };
    clearTimeout(n), n = setTimeout(f, o);
  };
}
function rt(a, o) {
  let n;
  return function(...h) {
    n || (a(...h), n = !0, setTimeout(() => n = !1, o));
  };
}
function ge(a, o) {
  return o === 0 ? a : ge(o, a % o);
}
function Ee(a, o) {
  const n = ge(a, o);
  return {
    width: a / n,
    height: o / n
  };
}
function Te(a, o) {
  return {
    cols: a.width * o,
    rows: a.height * o
  };
}
function Oe(a, o, n, l) {
  return {
    width: a / n,
    height: o / l
  };
}
function $e(a, o, n, l, h) {
  const f = Ee(a, o), v = Te(f, h), p = Oe(n, l, v.cols, v.rows);
  return {
    aspectRatio: f,
    gridDimensions: v,
    cellSize: p
  };
}
function te(a, o, n, l, h, f) {
  const v = Math.floor(a / n), p = Math.floor(o / l);
  return {
    row: Math.max(0, Math.min(p, f - 1)),
    col: Math.max(0, Math.min(v, h - 1))
  };
}
function st(a, o, n, l) {
  return {
    x: o * n,
    y: a * l,
    width: n,
    height: l
  };
}
function it(a, o, n, l, h, f) {
  const v = te(a.x, a.y, n, l, h, f), p = te(o.x, o.y, n, l, h, f), M = Math.min(v.row, p.row), w = Math.max(v.row, p.row), r = Math.min(v.col, p.col), c = Math.max(v.col, p.col), u = [];
  for (let m = M; m <= w; m++)
    for (let b = r; b <= c; b++)
      u.push({ row: m, col: b });
  return u;
}
function ve(a, o, n) {
  const l = [], h = /* @__PURE__ */ new Set();
  for (let f = 0; f < n; f++)
    for (let v = 0; v < o; v++) {
      const p = $(f, v);
      if (!a.has(p) || h.has(p))
        continue;
      let M = 1;
      for (; v + M < o && a.has($(f, v + M)) && !h.has($(f, v + M)); )
        M++;
      let w = 1, r = !0;
      for (; f + w < n && r; ) {
        for (let c = 0; c < M; c++)
          if (!a.has($(f + w, v + c)) || h.has($(f + w, v + c))) {
            r = !1;
            break;
          }
        r && w++;
      }
      for (let c = 0; c < w; c++)
        for (let u = 0; u < M; u++)
          h.add($(f + c, v + u));
      l.push({ x: v, y: f, width: M, height: w });
    }
  return l;
}
const ze = { class: "object-detection-marker" }, Be = { class: "canvas-container" }, We = ["width", "height"], Ae = {
  key: 0,
  class: "loading-indicator"
}, Xe = {
  key: 1,
  class: "error-message"
}, Ye = /* @__PURE__ */ he({
  __name: "ObjectDetectionMarker",
  props: {
    image: {},
    resolution: { default: 1 },
    selectionMode: { default: "point" },
    highlightColor: { default: "#007bff" },
    gridColor: { default: "#cccccc" },
    layerColors: { default: () => ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"] },
    canvasWidth: { default: 800 },
    canvasHeight: { default: 600 },
    hoverColor: { default: "#6c757d" },
    backgroundColor: { default: "#ffffff" },
    defaultBrushSize: { default: 1 },
    defaultBrushShape: { default: "circle" }
  },
  emits: ["selectionChange", "modeChange", "imageLoad", "imageError", "gridHover", "layerChange", "activeLayerChange", "layerVisibilityChange", "layerAdded", "layerRemoved"],
  setup(a, { expose: o, emit: n }) {
    const l = a, h = n, f = _(null), v = _(l.selectionMode || "point"), p = _(""), M = _(!1), w = _(null), r = _(null), c = _(null), u = _(null), m = _(!1), b = _(null), x = _(null), C = _(null), L = _(null), g = _(/* @__PURE__ */ new Map()), F = _(""), S = _(1), j = _("circle"), G = N(() => l.canvasWidth || 800), D = N(() => l.canvasHeight || 600), K = N(() => f.value?.getContext("2d") || null), W = (e, t) => {
      if (!e || !e.startsWith("#")) return `rgba(0, 0, 0, ${t})`;
      const s = parseInt(e.slice(1, 3), 16) || 0, i = parseInt(e.slice(3, 5), 16) || 0, d = parseInt(e.slice(5, 7), 16) || 0;
      return `rgba(${s}, ${i}, ${d}, ${t})`;
    }, E = (e) => ({
      "#FF0000": "빨강",
      "#00FF00": "초록",
      "#0000FF": "파랑",
      "#FFFF00": "노랑",
      "#FF00FF": "마젠타",
      "#00FFFF": "청록"
    })[e.toUpperCase()] || e, U = () => {
      g.value.clear();
      const e = l.layerColors || [];
      e.forEach((t) => {
        g.value.set(t.toUpperCase(), {
          color: t.toUpperCase(),
          selectedGrids: /* @__PURE__ */ new Set(),
          visible: !0,
          name: E(t),
          opacity: 0.5
        });
      }), e.length > 0 && (F.value = e[0].toUpperCase());
    }, T = (e) => {
      v.value = e, h("modeChange", e), e !== "rectangle" && (C.value = null, L.value = null), k();
    }, k = () => {
      const e = K.value;
      if (e) {
        if (e.fillStyle = l.backgroundColor, e.fillRect(0, 0, G.value, D.value), w.value && M.value && e.drawImage(w.value, 0, 0, G.value, D.value), A(e), X(e), b.value) {
          const t = g.value.get(F.value), s = t ? t.color : l.hoverColor;
          q(e, b.value, s, 0.25);
        }
        b.value && (v.value === "point" || v.value === "eraser") && ye(e), v.value === "rectangle" && C.value && L.value && we(e);
      }
    }, A = (e) => {
      if (u.value) {
        e.strokeStyle = l.gridColor, e.lineWidth = 1;
        for (let t = 0; t <= G.value; t += u.value.width)
          e.beginPath(), e.moveTo(t, 0), e.lineTo(t, D.value), e.stroke();
        for (let t = 0; t <= D.value; t += u.value.height)
          e.beginPath(), e.moveTo(0, t), e.lineTo(G.value, t), e.stroke();
      }
    }, X = (e) => {
      g.value.forEach((t) => {
        t.visible && t.selectedGrids.forEach((s) => {
          const [i, d] = s.split(",").map(Number);
          q(e, { row: i, col: d }, t.color, t.opacity);
        });
      });
    }, q = (e, t, s, i = 0.5) => {
      if (!u.value) return;
      const d = t.col * u.value.width, y = t.row * u.value.height;
      e.fillStyle = W(s, i), e.fillRect(d, y, u.value.width, u.value.height), e.strokeStyle = s, e.lineWidth = 2, e.strokeRect(d, y, u.value.width, u.value.height);
    }, we = (e) => {
      if (!C.value || !L.value || !u.value) return;
      const t = Math.min(C.value.col, L.value.col) * u.value.width, s = Math.min(C.value.row, L.value.row) * u.value.height, i = (Math.max(C.value.col, L.value.col) + 1) * u.value.width, d = (Math.max(C.value.row, L.value.row) + 1) * u.value.height, y = g.value.get(F.value), R = y ? y.color : l.highlightColor;
      e.strokeStyle = R, e.lineWidth = 2, e.setLineDash([5, 5]), e.strokeRect(t, s, i - t, d - s), e.setLineDash([]);
    }, ye = (e) => {
      if (!b.value || !u.value) return;
      const { row: t, col: s } = b.value, { width: i, height: d } = u.value, y = s * i + i / 2, R = t * d + d / 2, I = g.value.get(F.value), H = I ? I.color : l.highlightColor;
      if (e.strokeStyle = H, e.lineWidth = 2, e.setLineDash([3, 3]), j.value === "circle") {
        const O = (S.value - 0.5) * Math.min(i, d);
        e.beginPath(), e.arc(y, R, O, 0, Math.PI * 2), e.stroke();
      } else {
        const O = S.value * 2 - 1, ie = O * i, ce = O * d;
        e.strokeRect(
          y - ie / 2,
          R - ce / 2,
          ie,
          ce
        );
      }
      e.setLineDash([]);
    }, oe = (e) => {
      e.preventDefault();
      const t = ne(e.clientX, e.clientY);
      if (t) {
        if (m.value = !0, v.value === "rectangle")
          C.value = t, L.value = t;
        else {
          const s = v.value === "eraser" ? "deselect" : "select";
          Q(t, s), x.value = t;
        }
        Y(), k();
      }
    }, ae = (e) => {
      const t = ne(e.clientX, e.clientY);
      if ((b.value?.row !== t?.row || b.value?.col !== t?.col) && (b.value = t, h("gridHover", t), k()), !(!m.value || !t))
        if (v.value === "rectangle")
          L.value = t, k();
        else {
          const s = v.value === "eraser" ? "deselect" : "select";
          (!x.value || x.value.row !== t.row || x.value.col !== t.col) && (Q(t, s), x.value = t, Y(), k());
        }
    }, le = () => {
      if (m.value) {
        if (m.value = !1, v.value === "rectangle" && C.value && L.value) {
          const e = Math.min(C.value.row, L.value.row), t = Math.max(C.value.row, L.value.row), s = Math.min(C.value.col, L.value.col), i = Math.max(C.value.col, L.value.col);
          for (let d = e; d <= t; d++)
            for (let y = s; y <= i; y++)
              Q({ row: d, col: y }, "select");
          C.value = null, L.value = null, k();
        }
        x.value = null;
      }
    }, pe = () => {
      b.value = null, h("gridHover", null), m.value && (m.value = !1, x.value = null, v.value === "rectangle" && (C.value = null, L.value = null, k()));
    }, Ce = (e) => oe({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY, preventDefault: () => e.preventDefault() }), Me = (e) => ae({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY }), be = () => le(), ne = (e, t) => {
      const s = f.value?.getBoundingClientRect();
      if (!s || !u.value || !c.value) return null;
      const i = e - s.left, d = t - s.top;
      return te(i, d, u.value.width, u.value.height, c.value.cols, c.value.rows);
    }, Q = (e, t = "toggle") => {
      S.value > 1 && t !== "toggle" ? Re(e, t) : Z(e, t);
    }, Z = (e, t) => {
      const s = $(e.row, e.col), i = g.value.get(F.value);
      if (!i) return;
      const d = i.selectedGrids.has(s);
      switch (t) {
        case "select":
          d || i.selectedGrids.add(s);
          break;
        case "deselect":
          d && i.selectedGrids.delete(s);
          break;
        case "toggle":
          d ? i.selectedGrids.delete(s) : i.selectedGrids.add(s);
          break;
      }
    }, Re = (e, t) => {
      if (!c.value) return;
      const { rows: s, cols: i } = c.value, d = S.value;
      for (let y = e.row - d + 1; y < e.row + d; y++)
        for (let R = e.col - d + 1; R < e.col + d; R++)
          y >= 0 && y < s && R >= 0 && R < i && (j.value === "circle" ? Math.sqrt(Math.pow(y - e.row, 2) + Math.pow(R - e.col, 2)) < d && Z({ row: y, col: R }, t) : Z({ row: y, col: R }, t));
    }, re = () => {
      if (!w.value) return;
      const e = $e(
        w.value.naturalWidth,
        w.value.naturalHeight,
        G.value,
        D.value,
        l.resolution
      );
      r.value = e.aspectRatio, c.value = e.gridDimensions, u.value = e.cellSize;
    }, Fe = async (e) => {
      try {
        p.value = "", M.value = !1;
        const t = new Image();
        t.crossOrigin = "anonymous", await new Promise((s, i) => {
          if (t.onload = () => {
            w.value = t, re(), h("imageLoad", t), s();
          }, t.onerror = () => {
            p.value = "이미지를 불러오는데 실패했습니다.", h("imageError", new Error("Failed to load image")), i(new Error("Failed to load image"));
          }, typeof e == "string")
            t.src = e;
          else {
            const d = URL.createObjectURL(e);
            t._objectUrl = d, t.src = d;
          }
        });
      } catch (t) {
        p.value = t.message;
      } finally {
        M.value = !0;
      }
    }, _e = (e) => {
      F.value = e.toUpperCase(), h("activeLayerChange", F.value), k();
    }, Le = (e) => {
      const t = g.value.get(e.toUpperCase());
      t && (t.visible = !t.visible, h("layerVisibilityChange", e.toUpperCase(), t.visible), k());
    }, ke = () => {
      const e = g.value.get(F.value);
      return e ? e.selectedGrids.size : 0;
    }, se = () => Array.from(g.value.values()).reduce((e, t) => e + (t.visible ? t.selectedGrids.size : 0), 0), xe = () => {
      const e = {};
      return g.value.forEach((t, s) => {
        e[s] = Array.from(t.selectedGrids);
      }), {
        version: "1.1",
        imageSize: { width: w.value?.naturalWidth || 0, height: w.value?.naturalHeight || 0 },
        resolution: l.resolution,
        layers: e
      };
    }, Se = () => {
      if (!c.value) return null;
      const { rows: e, cols: t } = c.value, s = {};
      return g.value.forEach((i, d) => {
        s[d] = ve(i.selectedGrids, t, e);
      }), {
        version: "3.0-grid",
        metadata: { cols: t, rows: e },
        layers: s
      };
    }, Ge = (e) => {
      if (!e || !e.layers || !c.value) return;
      const { rows: t, cols: s } = c.value;
      (e.metadata.cols !== s || e.metadata.rows !== t) && console.warn("Importing data from a different grid resolution. Results may be inaccurate."), g.value.clear(), Object.entries(e.layers).forEach(([i, d]) => {
        const y = /* @__PURE__ */ new Set();
        d.forEach((I) => {
          for (let H = I.y; H < I.y + I.height; H++)
            for (let O = I.x; O < I.x + I.width; O++)
              y.add($(H, O));
        });
        const R = i.toUpperCase();
        g.value.set(R, {
          color: R,
          selectedGrids: y,
          visible: !0,
          name: E(R),
          opacity: 0.5
        });
      }), g.value.size > 0 && (F.value = Array.from(g.value.keys())[0]), k(), Y();
    }, De = (e) => {
      !e || !e.layers || (g.value.clear(), Object.entries(e.layers).forEach(([t, s]) => {
        const i = t.toUpperCase();
        g.value.set(i, {
          color: i,
          selectedGrids: new Set(s),
          visible: !0,
          name: E(i),
          opacity: 0.5
        });
      }), g.value.size > 0 && (F.value = Array.from(g.value.keys())[0]), k(), Y());
    }, Ue = () => {
      const e = {};
      if (!c.value) return {};
      const { rows: t, cols: s } = c.value;
      return g.value.forEach((i, d) => {
        if (i.visible && i.selectedGrids.size > 0) {
          const y = ve(i.selectedGrids, s, t);
          e[d] = y.map((R) => ({
            x: R.x / s,
            y: R.y / t,
            width: R.width / s,
            height: R.height / t
          }));
        }
      }), e;
    }, Y = () => {
      const e = {
        activeColor: F.value,
        layers: Array.from(g.value.values()).map((i) => ({ color: i.color, selectedCount: i.selectedGrids.size, visible: i.visible, name: i.name })),
        totalSelected: se()
      };
      h("layerChange", e);
      const t = [];
      g.value.forEach((i) => {
        i.visible && i.selectedGrids.forEach((d) => t.push({ row: parseInt(d.split(",")[0]), col: parseInt(d.split(",")[1]) }));
      });
      const s = {
        selectedCells: t,
        resolution: l.resolution,
        imageAspectRatio: r.value || { width: 1, height: 1 },
        gridDimensions: c.value || { cols: 1, rows: 1 },
        cellSize: u.value || { width: 1, height: 1 },
        imageWidth: w.value?.naturalWidth || 0,
        imageHeight: w.value?.naturalHeight || 0,
        canvasWidth: G.value,
        canvasHeight: D.value,
        layerData: e
      };
      h("selectionChange", s);
    };
    return P(() => l.image, (e) => {
      e && Fe(e);
    }, { immediate: !0 }), P(() => l.selectionMode, (e) => {
      e && T(e);
    }), P(() => l.resolution, () => {
      U(), re(), Y(), k();
    }), P(() => l.layerColors, () => {
      U(), k();
    }, { deep: !0 }), o({
      exportGridLayers: xe,
      importGridLayers: De,
      getSelectionAsPercentRects: Ue,
      exportOptimizedLayers: Se,
      importOptimizedLayers: Ge,
      // External control methods
      switchMode: T,
      setActiveColorLayer: _e,
      toggleLayerVisibility: Le,
      getColorLayers: () => g,
      getActiveColorLayer: () => F.value,
      getCurrentMode: () => v.value,
      getBrushSize: () => S.value,
      setBrushSize: (e) => {
        S.value = e;
      },
      getBrushShape: () => j.value,
      setBrushShape: (e) => {
        j.value = e;
      },
      getTotalSelectedCount: se,
      getActiveLayerCount: ke,
      getColorName: E
    }), de(() => {
      U(), S.value = l.defaultBrushSize, j.value = l.defaultBrushShape, f.value && k();
    }), je(() => {
      w.value && w.value._objectUrl && URL.revokeObjectURL(w.value._objectUrl);
    }), (e, t) => (B(), z("div", ze, [
      V("div", Be, [
        V("canvas", {
          ref_key: "canvasRef",
          ref: f,
          class: "marker-canvas",
          width: G.value,
          height: D.value,
          onMousedown: oe,
          onMousemove: ae,
          onMouseup: le,
          onMouseleave: pe,
          onTouchstart: ee(Ce, ["prevent"]),
          onTouchmove: ee(Me, ["prevent"]),
          onTouchend: ee(be, ["prevent"])
        }, null, 40, We),
        !M.value && l.image ? (B(), z("div", Ae, " 이미지를 로딩 중... ")) : J("", !0),
        p.value ? (B(), z("div", Xe, fe(p.value), 1)) : J("", !0)
      ])
    ]));
  }
}), me = (a, o) => {
  const n = a.__vccOpts || a;
  for (const [l, h] of o)
    n[l] = h;
  return n;
}, He = /* @__PURE__ */ me(Ye, [["__scopeId", "data-v-989cd7d1"]]), Pe = { class: "object-detection-preview" }, Ne = {
  key: 0,
  class: "skeleton-container"
}, Ve = {
  key: 1,
  class: "error-message"
}, Ke = /* @__PURE__ */ he({
  __name: "ObjectDetectionPreview",
  props: {
    image: {},
    selectionData: {},
    canvasWidth: {},
    canvasHeight: {},
    backgroundColor: {},
    layerColors: {},
    objectFitMode: {},
    renderMode: {}
  },
  setup(a) {
    const o = a, n = _(null), l = _(!1), h = _(""), f = N(() => o.objectFitMode || "contain"), v = N(() => o.renderMode || "grid"), p = (r) => {
      if (r.length === 0) return null;
      let c = 1 / 0, u = 1 / 0, m = -1 / 0, b = -1 / 0;
      return r.forEach((x) => {
        c = Math.min(c, x.x), u = Math.min(u, x.y), m = Math.max(m, x.x + x.width), b = Math.max(b, x.y + x.height);
      }), {
        x: c,
        y: u,
        width: m - c,
        height: b - u
      };
    }, M = async () => {
      const r = n.value, c = r?.getContext("2d");
      if (!c || !o.image || !r) return;
      const u = r.getBoundingClientRect();
      r.width = u.width, r.height = u.height, l.value = !1, h.value = "";
      try {
        const m = new Image();
        m.crossOrigin = "anonymous", await new Promise((b, x) => {
          m.onload = () => {
            if (!r) return;
            c.clearRect(0, 0, r.width, r.height);
            const C = m.width / m.height, L = r.width / r.height;
            let g, F, S, j;
            if (f.value === "contain" ? C > L ? (g = r.width, F = r.width / C, S = 0, j = (r.height - F) / 2) : (F = r.height, g = r.height * C, S = (r.width - g) / 2, j = 0) : C > L ? (F = r.height, g = r.height * C, S = (r.width - g) / 2, j = 0) : (g = r.width, F = r.width / C, S = 0, j = (r.height - F) / 2), c.drawImage(m, S, j, g, F), o.selectionData && o.selectionData.layers) {
              const { cols: G, rows: D } = o.selectionData.metadata;
              if (G === 0 || D === 0) return;
              Object.entries(o.selectionData.layers).forEach(([K, W]) => {
                if (W.length === 0) return;
                const E = o.layerColors?.[K] || { color: K, opacity: 0.5 };
                if (v.value === "rect") {
                  const U = p(W);
                  if (!U) return;
                  const T = U.x / G * r.width, k = U.y / D * r.height, A = U.width / G * r.width, X = U.height / D * r.height;
                  c.fillStyle = w(E.color, E.opacity), c.fillRect(T, k, A, X);
                } else {
                  const U = new Path2D();
                  W.forEach((T) => {
                    const k = T.x / G * r.width, A = T.y / D * r.height, X = T.width / G * r.width, q = T.height / D * r.height;
                    U.rect(k, A, X, q);
                  }), c.fillStyle = w(E.color, E.opacity), c.fill(U);
                }
              });
            }
            b();
          }, m.onerror = () => x(new Error("이미지를 불러올 수 없습니다.")), typeof o.image == "string" ? m.src = o.image : m.src = URL.createObjectURL(o.image);
        });
      } catch (m) {
        h.value = m.message;
      } finally {
        l.value = !0;
      }
    }, w = (r, c) => {
      if (!r || !r.startsWith("#")) return `rgba(0, 0, 0, ${c})`;
      const u = parseInt(r.slice(1, 3), 16) || 0, m = parseInt(r.slice(3, 5), 16) || 0, b = parseInt(r.slice(5, 7), 16) || 0;
      return `rgba(${u}, ${m}, ${b}, ${c})`;
    };
    return P(() => [o.image, o.selectionData], M, { deep: !0 }), de(() => {
      M();
    }), (r, c) => (B(), z("div", Pe, [
      !l.value && !h.value ? (B(), z("div", Ne, c[0] || (c[0] = [
        V("div", { class: "skeleton-shimmer" }, null, -1),
        V("div", { class: "skeleton-text" }, "미리보기 로딩 중...", -1)
      ]))) : J("", !0),
      V("canvas", {
        ref_key: "previewCanvasRef",
        ref: n,
        class: Ie(["preview-canvas", {
          "canvas-loaded": l.value,
          "fit-contain": f.value === "contain",
          "fit-cover": f.value === "cover"
        }])
      }, null, 2),
      h.value ? (B(), z("div", Ve, fe(h.value), 1)) : J("", !0)
    ]));
  }
}), qe = /* @__PURE__ */ me(Ke, [["__scopeId", "data-v-6f1cf08a"]]), ct = {
  install(a) {
    a.component("ObjectDetectionMarker", He), a.component("ObjectDetectionPreview", qe);
  }
};
export {
  He as ObjectDetectionMarker,
  qe as ObjectDetectionPreview,
  Ee as calculateAspectRatio,
  Oe as calculateCellSize,
  Te as calculateGridDimensions,
  $e as calculateGridFromResolution,
  Ze as cleanupImage,
  nt as debounce,
  ct as default,
  ge as gcd,
  ot as getDistance,
  lt as getGridCellsInRectangle,
  it as getGridCellsInRectangleResolution,
  $ as getGridKey,
  et as gridToScreen,
  st as gridToScreenResolution,
  at as isPointInRectangle,
  Qe as loadImage,
  ve as mergeGridsToRects,
  tt as parseGridKey,
  ue as screenToGrid,
  te as screenToGridResolution,
  rt as throttle
};
