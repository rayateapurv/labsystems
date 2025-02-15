import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { InteractionManager } from "https://cdn.jsdelivr.net/npm/three.interactive@1.3.0/build/three.interactive.min.js";
import {Group, Tween} from "tween";

let earthradius = 5;
let sceneNum = 8;

const canvas = document.querySelector("#glcanvas");

const scene = new THREE.Scene();
scene.background = new THREE.Color("#081119");

const model = new THREE.Group();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const amblight = new THREE.AmbientLight(0xffffff);
scene.add(amblight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 7;
controls.maxDistance = 60;

const parseData = (data) => {
  let lines = data.split(/(?:\r\n|\n)+/).filter(function (el) {
    return el.length != 0;
  });
  let elements = [];

  for (let i = 0; i < lines.length; i++) {
    let element = lines[i].split(",");
    elements.push(element);
  }
  return elements;
};

const normalizeBetweenTwoRanges = (val, minVal, maxVal, newMin, newMax) => {
  return newMin + ((val - minVal) * (newMax - newMin)) / (maxVal - minVal);
};

let sats = parseData(satdata);

let sites = parseData(sitedata);

let cities = parseData(citydata);

let col = "#870e53"; //511633
let col2 = "#47ff96";
let col3 = "#2f92a8";
let col4 = "#8c8c8c";
//console.log(sats);

const satObjects = [];
const siteObjects = [];
const linkObjects = [];
const citylinkObjects = [];
const cityObjects = [];

const satTweenGroup = new Group()
const siteTweenGroup = new Group()
const cityTweenGroup = new Group()

const interactionManager = new InteractionManager(
  renderer,
  camera,
  renderer.domElement
);

const earth = new THREE.Mesh(
  new THREE.SphereGeometry(earthradius, 50, 50),
  new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load("../cas-website/assets/img/map2.png"),
    color: 0xaaaaaa,
    specular: 0x333333,
    shininess: 25,
  })
);
model.add(earth);

const orbit = new THREE.Mesh(
  new THREE.RingGeometry(28, 28.015, 256),
  new THREE.MeshPhongMaterial({
    color: 0xaaaaaa,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.6,
  })
);
orbit.rotation.x = Math.PI / 2;
model.add(orbit);

const starGeometry = new THREE.SphereGeometry(100, 50, 50);
const starMaterial = new THREE.MeshPhongMaterial({
  map: new THREE.TextureLoader().load("../cas-website/assets/img/stars.png"),
  side: THREE.DoubleSide,
  shininess: 0,
});
const starField = new THREE.Mesh(starGeometry, starMaterial);
scene.add(starField);

// let satellite = (xco, yco, zco, size, color) => {
//     let sat = new THREE.Mesh(
//         new THREE.SphereGeometry(size, 50, 50),
//         new THREE.MeshPhongMaterial({
//             color: color,
//             transparent: true,
//             opacity: 0.75
//         }));
//     sat.position.set(xco, yco, zco);
//     return sat;
// };

let mapLatLon = (lat, lon, radius) => {
  let phi = (90 - lat) * (Math.PI / 180);
  let theta = (lon + 180) * (Math.PI / 180);
  let x = -(radius * Math.sin(phi) * Math.cos(theta));
  let z = radius * Math.sin(phi) * Math.sin(theta);
  let y = radius * Math.cos(phi);

  let pos = new THREE.Vector3(x, y, z);
  return pos;
};

let city = (xco, yco, zco, size, color, type) => {
  let mat = new THREE.MeshPhongMaterial({
    color: color,
    transparent: true,
    opacity: 0.75,
  });
  let cit;
  if (type == "city") {
    cit = new THREE.Mesh(new THREE.SphereGeometry(size, 50, 50), mat);
  } else if (type == "site") {
    cit = new THREE.Mesh(new THREE.IcosahedronGeometry(size), mat);
  }
  cit.position.set(xco, yco, zco);
  return cit;
};

let texts = [];
let objectName = (xco, yco, zco, size, color, name) => {
  const loader = new FontLoader();
  loader.load("../cas-website/assets/font/Space_Mono_Regular.json", (font) => {
    const matLite = new THREE.MeshPhongMaterial({
      color: color,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide,
    });

    const message = name;
    const shapes = font.generateShapes(message, size);
    const geometry = new THREE.ShapeGeometry(shapes);
    geometry.computeBoundingBox();
    const xMid =
      -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    geometry.translate(xMid, 0, 0);
    let text = new THREE.Mesh(geometry, matLite);
    text.position.set(xco, yco, zco);
    model.add(text);
    texts.push(text);
  });
};

//let green = cityName(5, 0, 5, "green");

let satellite = (xco, yco, zco, color, facetype, nosetype, tailtype, size) => {
  let mat = new THREE.MeshPhongMaterial({
    color: color,
  });

  let mat2 = new THREE.MeshPhongMaterial({
    color: col,
  });

  let flatmat = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load("../cas-website/assets/img/panel.png"),
    side: THREE.DoubleSide,
  });

  let body = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.4, 16), mat);

  body.rotation.x = Math.PI / 2;

  let faceval;
  if (facetype == "c") {
    faceval = 32;
  } else if (facetype == "t") {
    faceval = 3;
  } else if (facetype == "s") {
    faceval = 4;
  } else if (facetype == "p") {
    faceval = 5;
  } else if (facetype == "h") {
    faceval = 6;
  }
  let face = new THREE.Mesh(
    new THREE.RingGeometry(0.15, 0.2, faceval),
    flatmat
  );
  face.position.z = 0.15;

  let nose;
  if (nosetype == "c") {
    nose = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.01, 8, 32), mat2);
  } else if (nosetype == "g") {
    nose = new THREE.Mesh(new THREE.TorusKnotGeometry(0.04, 0.01, 32, 8), mat2);
  } else if (nosetype == "m") {
    nose = new THREE.Mesh(new THREE.OctahedronGeometry(0.04), mat2);
  }
  nose.position.z = 0.25;

  let tail = new THREE.Group();
  if (tailtype == "19") {
    let pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.006, 0.006, 0.8, 32),
      mat
    );
    let plane1 = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.4), flatmat);
    plane1.position.y = -0.4;
    let plane2 = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.4), flatmat);
    plane2.position.y = 0.4;
    tail.add(pole);
    tail.add(plane1);
    tail.add(plane2);
  } else if (tailtype == "20") {
    let branch1 = new THREE.Group();
    let pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.006, 0.006, 0.4, 32),
      mat
    );
    let plane = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.4), flatmat);
    pole.position.y = -0.3;
    plane.position.y = -0.4;
    branch1.add(pole);
    branch1.add(plane);
    let branch2 = branch1.clone();
    branch2.rotation.z = (2 * Math.PI) / 3;
    let branch3 = branch1.clone();
    branch3.rotation.z = (4 * Math.PI) / 3;
    tail.add(branch1);
    tail.add(branch2);
    tail.add(branch3);
  } else if (tailtype == "21") {
    let branch1 = new THREE.Group();
    let pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.006, 0.006, 0.8, 32),
      mat
    );
    let plane1 = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.4), flatmat);
    plane1.position.y = -0.4;
    let plane2 = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.4), flatmat);
    plane2.position.y = 0.4;
    branch1.add(pole);
    branch1.add(plane1);
    branch1.add(plane2);
    let branch2 = branch1.clone();
    branch2.rotation.z = Math.PI / 2;
    tail.add(branch1);
    tail.add(branch2);
  }
  tail.position.z = -0.15;

  let si = normalizeBetweenTwoRanges(size, 0, 7600, 0.7, 1.5);

  let sat = new THREE.Group();
  sat.add(body);
  sat.add(face);
  sat.add(nose);
  sat.add(tail);
  sat.position.set(xco, yco, zco);
  sat.scale.set(si, si, si);
  sat.rotation.y = Math.random() * (Math.PI * 2);
  return sat;
};

let link = (xco1, yco1, zco1, xco2, yco2, zco2, color, rad) => {
  let mat = new THREE.LineBasicMaterial({
    color: color,
    linewidth: 1,
  });

  let radius = rad;

  let curve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(xco1, yco1, zco1),
    new THREE.Vector3(xco1, yco1 + radius, zco1),
    new THREE.Vector3(xco1, yco1 + radius, zco1 - radius / 2),
    new THREE.Vector3(xco2, yco2, zco2)
  );

  const points = curve.getPoints(50);

  let geo = new THREE.BufferGeometry().setFromPoints(points);

  let line = new THREE.Line(geo, mat);
  return line;
};

let link2 = (xco1, yco1, zco1, xco2, yco2, zco2, color, rad) => {
  let mat = new THREE.LineBasicMaterial({
    color: color,
    linewidth: 1,
  });

  let radius = rad;

  let curve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(xco1, yco1, zco1),
    new THREE.Vector3(xco1, yco1 + radius / 2, zco1),
    new THREE.Vector3(xco2, yco2 + radius * 2, zco2),
    new THREE.Vector3(xco2, yco2, zco2)
  );

  const points = curve.getPoints(50);

  let geo = new THREE.BufferGeometry().setFromPoints(points);

  let line = new THREE.Line(geo, mat);
  return line;
};

//console.log(sats);

for (let i = 1; i < sats.length; i++) {
  let lat = parseFloat(sats[i][0]);
  let lon = parseFloat(sats[i][1]);

  let pos = mapLatLon(lat, lon, 28);

  let facetype;
  if (sats[i][6] == "Communications") {
    facetype = "c";
  } else if (sats[i][6] == "Navigation/Global Positioning") {
    facetype = "t";
  } else if (sats[i][6] == "Earth Observation") {
    facetype = "s";
  } else if (sats[i][6] == "Mission Extension Technology") {
    facetype = "p";
  } else if (sats[i][6] == "Technology Development") {
    facetype = "h";
  }

  let nosetype;
  if (sats[i][5] == "Commercial") {
    nosetype = "c";
  } else if (sats[i][5] == "Government") {
    nosetype = "g";
  } else if (sats[i][5] == "Military") {
    nosetype = "m";
  }

  let tailtype;
  if (sats[i][4].substring(0, 4) == "2019") {
    tailtype = "19";
  } else if (sats[i][4].substring(0, 4) == "2020") {
    tailtype = "20";
  } else if (sats[i][4].substring(0, 4) == "2021") {
    tailtype = "21";
  }

  let satel = satellite(
    pos.x,
    pos.y,
    pos.z,
    col3,
    facetype,
    nosetype,
    tailtype,
    parseFloat(sats[i][3])
  );
  model.add(satel);

  //satel.children[0].geometry.computeBoundingBox();

  objectName(
    pos.x,
    pos.y - (Math.random() * (1.1 - 0.9) + 0.9),
    pos.z,
    0.075,
    col3,
    sats[i][7]
  );

  let camposview = mapLatLon(lat, lon, 31);
  let posarrayview = { x: camposview.x, y: camposview.y, z: camposview.z };

  satObjects[i - 1] = {
    satellite: satel,
    site: sats[i][2],
    camPosView: posarrayview,
    city: sats[i][9],
    name: sats[i][7],
  };
}

//console.log(sites);

let sitepos = [];
for (let i = 1; i < sites.length; i++) {
  let lat = parseFloat(sites[i][1]);
  let lon = parseFloat(sites[i][2]);

  let pos = mapLatLon(lat, lon, earthradius);
  //console.log(pos);
  sitepos.push({ site: sites[i][0], pos: pos });

  let site = city(pos.x, pos.y, pos.z, 0.15, col4, "site");
  model.add(site);

  if (sites[i][0] == "Guiana Space Center") {
    objectName(pos.x, pos.y + 0.2, pos.z + 0.06, 0.075, col4, sites[i][0]);
  } else {
    objectName(pos.x, pos.y + 0.2, pos.z, 0.075, col4, sites[i][0]);
  }

  let camposspace = mapLatLon(lat, lon, 50);
  let posarrayspace = { x: camposspace.x, y: camposspace.y, z: camposspace.z };

  siteObjects[i - 1] = {
    siteObj: site,
    siteName: sites[i][0],
    country: sites[i][3],
    camPosSpace: posarrayspace,
  };
}

let citypos = [];
for (let i = 1; i < cities.length; i++) {
  let lat = parseFloat(cities[i][1]);
  let lon = parseFloat(cities[i][2]);

  let pos = mapLatLon(lat, lon, earthradius);
  //console.log(pos);
  citypos.push({ city: cities[i][0], pos: pos, country: cities[i][3] });

  let place = city(pos.x, pos.y, pos.z, 0.075, col3, "city");
  model.add(place);

  if (cities[i][0] == "Jakarta") {
    objectName(
      pos.x,
      pos.y + 0.3,
      pos.z - 0.08,
      0.075,
      col3,
      " " + `${cities[i][0]}\n${cities[i][3]}`
    );
  } else if (cities[i][0] == "Beijing") {
    objectName(
      pos.x,
      pos.y + 0.3,
      pos.z - 0.08,
      0.075,
      col3,
      `${cities[i][0]}\n` + " " + `${cities[i][3]}`
    );
  } else if (cities[i][0] == "Paris") {
    objectName(
      pos.x,
      pos.y + 0.3,
      pos.z - 0.08,
      0.075,
      col3,
      " " + `${cities[i][0]}\n${cities[i][3]}`
    );
  } else if (cities[i][0] == "Washington D.C.") {
    objectName(
      pos.x,
      pos.y + 0.3,
      pos.z - 0.08,
      0.075,
      col3,
      `${cities[i][0]}\n` + "     " + `${cities[i][3]}`
    );
  } else if (cities[i][0].length > cities[i][3].length) {
    objectName(
      pos.x,
      pos.y + 0.3,
      pos.z,
      0.075,
      col3,
      `${cities[i][0]}\n` + "  " + `${cities[i][3]}`
    );
  } else if (cities[i][0].length < cities[i][3].length) {
    objectName(
      pos.x,
      pos.y + 0.3,
      pos.z,
      0.075,
      col3,
      "   " + `${cities[i][0]}\n${cities[i][3]}`
    );
  } else if (cities[i][0].length == cities[i][3].length) {
    objectName(
      pos.x,
      pos.y + 0.3,
      pos.z,
      0.075,
      col3,
      `${cities[i][0]}\n${cities[i][3]}`
    );
  }

  let camposspace = mapLatLon(lat, lon, 50);
  let posarrayspace = { x: camposspace.x, y: camposspace.y, z: camposspace.z };

  cityObjects[i - 1] = {
    cityObj: place,
    city: cities[i][0],
    camPosSpace: posarrayspace,
    country: cities[i][3],
  };
}

//console.log(cities);

satObjects.forEach((d) => {
  let xco1, yco1, zco1;
  let rad;
  if (d["site"] == "Cape Canaveral") {
    xco1 = sitepos[0]["pos"].x;
    yco1 = sitepos[0]["pos"].y;
    zco1 = sitepos[0]["pos"].z;
    rad = 9;
  } else if (d["site"] == "Guiana Space Center") {
    xco1 = sitepos[1]["pos"].x;
    yco1 = sitepos[1]["pos"].y;
    zco1 = sitepos[1]["pos"].z;
    rad = 13;
  } else if (d["site"] == "Baikonur Cosmodrome") {
    xco1 = sitepos[2]["pos"].x;
    yco1 = sitepos[2]["pos"].y;
    zco1 = sitepos[2]["pos"].z;
    rad = 6;
  } else if (d["site"] == "Satish Dhawan Space Centre") {
    xco1 = sitepos[3]["pos"].x;
    yco1 = sitepos[3]["pos"].y;
    zco1 = sitepos[3]["pos"].z;
    rad = 5;
  } else if (d["site"] == "Wenchang Satellite Launch Center") {
    xco1 = sitepos[4]["pos"].x;
    yco1 = sitepos[4]["pos"].y;
    zco1 = sitepos[4]["pos"].z;
    rad = 4.5;
  } else if (d["site"] == "Xichang Satellite Launch Center") {
    xco1 = sitepos[5]["pos"].x;
    yco1 = sitepos[5]["pos"].y;
    zco1 = sitepos[5]["pos"].z;
    rad = 12.5;
  } else if (d["site"] == "Tanegashima Space Center") {
    xco1 = sitepos[6]["pos"].x;
    yco1 = sitepos[6]["pos"].y;
    zco1 = sitepos[6]["pos"].z;
    rad = 3.5;
  }
  let xco2, yco2, zco2;
  xco2 = d["satellite"].position.x;
  yco2 = d["satellite"].position.y;
  zco2 = d["satellite"].position.z;

  let con = link(xco1, yco1, zco1, xco2, yco2, zco2, col, rad);
  model.add(con);

  linkObjects.push({ obj: con, site: d["site"], name: d["name"] });
});

//console.log(citypos);

satObjects.forEach((d) => {
  let xco1, yco1, zco1;
  let color;
  for (let i = 0; i < citypos.length; i++) {
    //console.log(citypos[i]["city"])
    if (d["city"] == citypos[i]["city"]) {
      if (citypos[i]["city"] == "Jakarta") {
        xco1 = citypos[i]["pos"].x;
        yco1 = citypos[i]["pos"].y;
        zco1 = citypos[i]["pos"].z - 0.02;
      } else {
        xco1 = citypos[i]["pos"].x;
        yco1 = citypos[i]["pos"].y;
        zco1 = citypos[i]["pos"].z;
      }
    }
  }

  let xco2, yco2, zco2;
  xco2 = d["satellite"].position.x;
  yco2 = d["satellite"].position.y;
  zco2 = d["satellite"].position.z;

  let con = link(xco1, yco1, zco1, xco2, yco2, zco2, col4, 5);
  model.add(con);

  citylinkObjects.push({ obj: con, city: d["city"], name: d["name"] });
});

//console.log(siteObjects);
//console.log(citypos);

siteObjects.forEach((d) => {
  let xco1, yco1, zco1;
  let rad;
  for (let i = 0; i < citypos.length; i++) {
    //console.log(citypos[i]["city"])
    if (d["country"] == "France") {
      xco1 = citypos[8]["pos"].x;
      yco1 = citypos[8]["pos"].y;
      zco1 = citypos[8]["pos"].z;
      rad = 2;
    } else if (d["country"] == citypos[i]["country"]) {
      xco1 = citypos[i]["pos"].x;
      yco1 = citypos[i]["pos"].y;
      zco1 = citypos[i]["pos"].z;
      rad = 0.7;
    }
  }

  let xco2, yco2, zco2;
  xco2 = d["siteObj"].position.x;
  yco2 = d["siteObj"].position.y;
  zco2 = d["siteObj"].position.z;

  let con = link2(xco1, yco1, zco1, xco2, yco2, zco2, col4, rad);
  model.add(con);

  citylinkObjects.push({
    obj: con,
    country: d["country"],
    site: d["siteName"],
  });
});

//console.log(citylinkObjects);

satObjects.forEach((d) => {
  //console.log(d["siteName"], d["siteObj"], d["camPosSky"]);
  d["satellite"].addEventListener("click", (event) => {
    event.stopPropagation();
    let camPos = d["camPosView"];
    //console.log(`${d["site"]} was clicked`);
    const coords = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    };
    const tw = new Tween(coords)
      .to({ x: camPos.x, y: camPos.y, z: camPos.z }, 1000)
      .onUpdate(() => {
        camera.position.set(coords.x, coords.y, coords.z);
      })
      .start();
    satTweenGroup.add(tw);

    for (let i = 0; i < satObjects.length; i++) {
      satObjects[i]["satellite"].children[2].material.color.set(col);
      satObjects[i]["satellite"].children[1].material.emissive.set("#000000");
      if (satObjects[i]["name"] == d["name"]) {
        satObjects[i]["satellite"].children[2].material.color.set(col2);
        satObjects[i]["satellite"].children[1].material.emissive.set(col2);
      }
    }

    for (let i = 0; i < siteObjects.length; i++) {
      siteObjects[i]["siteObj"].material.color.set(col4);
      if (siteObjects[i]["siteName"] == d["site"]) {
        siteObjects[i]["siteObj"].material.color.set(col2);
      }
    }

    for (let i = 0; i < cityObjects.length; i++) {
      cityObjects[i]["cityObj"].material.color.set(col3);
      if (cityObjects[i]["city"] == d["city"]) {
        cityObjects[i]["cityObj"].material.color.set(col2);
      }
    }

    for (let i = 0; i < linkObjects.length; i++) {
      linkObjects[i]["obj"].material.color.set(col);
      if (linkObjects[i]["name"] == d["name"]) {
        linkObjects[i]["obj"].material.color.set(col2);
      }
    }

    for (let i = 0; i < citylinkObjects.length; i++) {
      citylinkObjects[i]["obj"].material.color.set(col4);
      if (citylinkObjects[i]["name"] == d["name"]) {
        //console.log("found");
        citylinkObjects[i]["obj"].material.color.set(col2);
      }
    }
  });
  interactionManager.add(d["satellite"]);
});

siteObjects.forEach((d) => {
  //console.log(d["siteName"], d["siteObj"], d["camPosSky"]);
  d["siteObj"].addEventListener("click", (event) => {
    event.stopPropagation();
    let camPos = d["camPosSpace"];
    //console.log(`${d["siteName"]} was clicked`);
    const coords = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    };
    const tw = new Tween(coords)
      .to({ x: camPos.x, y: camPos.y, z: camPos.z }, 1000)
      .onUpdate(() => {
        camera.position.set(coords.x, coords.y, coords.z);
      })
      .start();
    siteTweenGroup.add(tw);

    for (let i = 0; i < satObjects.length; i++) {
      satObjects[i]["satellite"].children[2].material.color.set(col);
      satObjects[i]["satellite"].children[1].material.emissive.set("#000000");
      if (satObjects[i]["site"] == d["siteName"]) {
        satObjects[i]["satellite"].children[2].material.color.set(col2);
        satObjects[i]["satellite"].children[1].material.emissive.set(col2);
      }
    }

    for (let i = 0; i < siteObjects.length; i++) {
      siteObjects[i]["siteObj"].material.color.set(col4);
      if (siteObjects[i]["siteName"] == d["siteName"]) {
        siteObjects[i]["siteObj"].material.color.set(col2);
      }
    }

    for (let i = 0; i < cityObjects.length; i++) {
      cityObjects[i]["cityObj"].material.color.set(col3);
    }

    for (let i = 0; i < linkObjects.length; i++) {
      linkObjects[i]["obj"].material.color.set(col);
      if (linkObjects[i]["site"] == d["siteName"]) {
        linkObjects[i]["obj"].material.color.set(col2);
      }
    }

    for (let i = 0; i < citylinkObjects.length; i++) {
      citylinkObjects[i]["obj"].material.color.set(col4);
    }
  });
  interactionManager.add(d["siteObj"]);
});

cityObjects.forEach((d) => {
  //console.log(d["siteName"], d["siteObj"], d["camPosSky"]);
  d["cityObj"].addEventListener("click", (event) => {
    event.stopPropagation();
    let camPos = d["camPosSpace"];
    //console.log(`${d["siteName"]} was clicked`);
    const coords = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    };
    const tw = new Tween(coords)
      .to({ x: camPos.x, y: camPos.y, z: camPos.z }, 1000)
      .onUpdate(() => {
        camera.position.set(coords.x, coords.y, coords.z);
      })
      .start();
    cityTweenGroup.add(tw);

    for (let i = 0; i < satObjects.length; i++) {
      satObjects[i]["satellite"].children[2].material.color.set(col);
      satObjects[i]["satellite"].children[1].material.emissive.set("#000000");
      if (satObjects[i]["city"] == d["city"]) {
        satObjects[i]["satellite"].children[2].material.color.set(col2);
        satObjects[i]["satellite"].children[1].material.emissive.set(col2);
      }
    }

    for (let i = 0; i < siteObjects.length; i++) {
      siteObjects[i]["siteObj"].material.color.set(col4);
      if (siteObjects[i]["country"] == d["country"]) {
        siteObjects[i]["siteObj"].material.color.set(col2);
      }
    }

    for (let i = 0; i < cityObjects.length; i++) {
      cityObjects[i]["cityObj"].material.color.set(col3);
      if (cityObjects[i]["city"] == d["city"]) {
        cityObjects[i]["cityObj"].material.color.set(col2);
      }
    }

    for (let i = 0; i < linkObjects.length; i++) {
      linkObjects[i]["obj"].material.color.set(col);
    }

    for (let i = 0; i < citylinkObjects.length; i++) {
      citylinkObjects[i]["obj"].material.color.set(col4);
      if (citylinkObjects[i]["city"] == d["city"]) {
        citylinkObjects[i]["obj"].material.color.set(col2);
      } else if (citylinkObjects[i]["country"] == d["country"]) {
        citylinkObjects[i]["obj"].material.color.set(col2);
      }
    }
  });
  interactionManager.add(d["cityObj"]);
});

//console.log(siteObjects);
//console.log(citylinkObjects);

camera.position.set(0, 20, -45);

//Vector pointing towards the earth
let earthVec = new THREE.Vector3(0, 0, 0);

scene.add(model);

const animate = () => {
  texts.forEach((d) => {
    d.lookAt(camera.position);
  });

  camera.lookAt(earthVec);

  satTweenGroup.update();
  siteTweenGroup.update();
  cityTweenGroup.update();

  requestAnimationFrame(animate);

  renderer.render(scene, camera);
};

animate();

let num = 0;
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  if (num == 0) {
    renderer.setSize(window.innerWidth, window.innerHeight);
    let tex = document.querySelector(".help");
    tex.style.marginTop = "50%";
    num = 1;
  } else {
    renderer.setSize(window.innerWidth, window.innerHeight);
    let tex = document.querySelector(".help");
    tex.style.marginTop = "70%";
    num = 0;
  }
});

const first = document.querySelector(".first");
first.appendChild(canvas);
