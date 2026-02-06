async function loadSvgDefs() {
  const res = await fetch("mapDefs.json");
  const { defsMarkup } = await res.json();
  const defs = document.getElementById("mapDefs");
  if (!defs) return;
  defs.innerHTML = defsMarkup;
}

async function loadMapShapes() {
  await loadSvgDefs();
  const res = await fetch("mapShapes.json");
  const shapes = await res.json();

  shapes.forEach((shape) => {
    const group = document.getElementById(shape.groupId);
    if (!group) return;

    const svgNS = "http://www.w3.org/2000/svg";
    let el;

    if (shape.type === "rect") {
      el = document.createElementNS(svgNS, "rect");
      if (shape.x != null) el.setAttribute("x", shape.x);
      if (shape.y != null) el.setAttribute("y", shape.y);
      if (shape.width != null) el.setAttribute("width", shape.width);
      if (shape.height != null) el.setAttribute("height", shape.height);
      if (shape.rx != null) el.setAttribute("rx", shape.rx);
      if (shape.transform) el.setAttribute("transform", shape.transform);
    } else if (shape.type === "path") {
      el = document.createElementNS(svgNS, "path");
      el.setAttribute("d", shape.d);
      if (shape.transform) el.setAttribute("transform", shape.transform);
    } else {
      return; // unknown type
    }

    if (shape.id) el.setAttribute("id", shape.id);
    if (shape.class) el.setAttribute("class", shape.class);
    if (shape.dataStore) el.setAttribute("data-store", shape.dataStore);
    if (shape.fill != null) {
      el.setAttribute("fill", shape.fill);
    }

    group.appendChild(el);
  });

  initMapInteraction();
}

window.addEventListener("load", loadMapShapes);
