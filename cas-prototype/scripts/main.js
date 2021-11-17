import * as THREE from 'https://cdn.skypack.dev/three@0.133.1';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/controls/OrbitControls.js';
import { InteractionManager } from 'https://cdn.skypack.dev/three.interactive';
import * as TWEEN from 'https://cdn.skypack.dev/@tweenjs/tween.js';

let earthradius = 5;
let sceneNum = 0;

const canvas = document.querySelector('#glcanvas');

const scene = new THREE.Scene();
scene.background = new THREE.Color('#14083a');

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
    canvas: canvas, antialias: true
});
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

const amblight = new THREE.AmbientLight( 0xfdfcf0 );
scene.add( amblight );

const dirlight = new THREE.DirectionalLight( 0xfdfcf0, 1 );
//dirlight.position.set(20,10,20)
//scene.add( dirlight );

const controls = new OrbitControls( camera, renderer.domElement );

let parseData = (data) => {
    let lines = data.split(/(?:\r\n|\n)+/).filter(function(el) {return el.length != 0});
    let elements = [];

    for (let i = 0; i < lines.length; i++) {
    let element = lines[i].split(",");
    elements.push(element);
    }
    return elements;
}

let sats = parseData(satdata);

let sites = parseData(sitedata);

const colors = [0xcc66ff, 0xffff66, 0xff3399, 0x0099ff, 0xff5050, 0xff9900, 0x00cc00];
//console.log(sats);

const satObjects = [];
const siteObjects = [];


const interactionManager = new InteractionManager(
    renderer,
    camera,
    renderer.domElement
);


const earth = new THREE.Mesh( 
    new THREE.SphereGeometry(earthradius, 50, 50), 
    new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load("../globe/assets/img/map.png"),
        color: 0xaaaaaa,
        specular: 0x333333,
        shininess: 25,
    })
);
scene.add( earth );

let satellite = (xco, yco, zco, size, color) => {
    let sat = new THREE.Mesh(
        new THREE.SphereGeometry(size, 50, 50), 
        new THREE.MeshPhongMaterial({
            color: color
        }));
    sat.position.set(xco, yco, zco);
    return sat;
};

for (let i = 1; i < sats.length; i++) {
    let color;
    if(sats[i][2] == "Cape Canaveral"){
        color = colors[4];
    } else if (sats[i][2] == "Xichang Satellite Launch Center") {
        color = colors[3];
    } else if (sats[i][2] == "Guiana Space Center") {
        color = colors[1];
    } else if (sats[i][2] == "Baikonur Cosmodrome") {
        color = colors[6];
    } else if (sats[i][2] == "Satish Dhawan Space Centre") {
        color = colors[0];
    } else if (sats[i][2] == "Tanegashima Space Center") {
        color = colors[5];
    } else if (sats[i][2] == "Wenchang Satellite Launch Center") {
        color = colors[2];
    }

    let satel = satellite(sats[i][0], 0, sats[i][1], 0.2, color);
    scene.add(satel);
    satObjects[i - 1] = {satellite: satel, site: sats[i][2]};
};

let mapLatLon = (lat, lon, radius) => {
    let phi   = (90-lat)*(Math.PI/180);
    let theta = (lon+180)*(Math.PI/180);
    let x = -((radius) * Math.sin(phi)*Math.cos(theta));
    let z = ((radius) * Math.sin(phi)*Math.sin(theta));
    let y = ((radius) * Math.cos(phi));

    let pos = new THREE.Vector3(x, y, z);
    return pos;
}

for (let i = 1; i < sites.length; i++) {
    let lat = parseFloat(sites[i][1]);
    let lon = parseFloat(sites[i][2]);

    let pos = mapLatLon(lat, lon, earthradius);
    //console.log(pos);

    let color;
    if(sites[i][0] == "Cape Canaveral"){
        color = colors[4];
    } else if (sites[i][0] == "Xichang Satellite Launch Center") {
        color = colors[3];
    } else if (sites[i][0] == "Guiana Space Center") {
        color = colors[1];
    } else if (sites[i][0] == "Baikonur Cosmodrome") {
        color = colors[6];
    } else if (sites[i][0] == "Satish Dhawan Space Centre") {
        color = colors[0];
    } else if (sites[i][0] == "Tanegashima Space Center") {
        color = colors[5];
    } else if (sites[i][0] == "Wenchang Satellite Launch Center") {
        color = colors[2];
    }
    
    let site = satellite(pos.x, pos.y, pos.z, 0.1, color);
    scene.add(site);

    let campossky = mapLatLon(lat, lon, earthradius * 2);
    let camposspace = mapLatLon(lat, lon, 50);
    let posarraysky = {x: campossky.x, y: campossky.y, z: campossky.z}; 
    let posarrayspace = {x: camposspace.x, y: camposspace.y, z: camposspace.z}; 

    siteObjects[i - 1] = {siteObj: site, siteName: sites[i][0], camPosSky: posarraysky, camPosSpace: posarrayspace};
};

// siteObjects.forEach( (d) => {
//     //console.log(d["siteName"], d["siteObj"], d["camPosSky"]);
//     d["siteObj"].addEventListener("click", (event) => {
//         event.stopPropagation();
//         let camPos = d["camPosSky"];
//         console.log(`${d["siteName"]} was clicked`);
//         const coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z};
//         new TWEEN.Tween(coords)
//         .to({x: camPos.x, y: camPos.y, z: camPos.z}, 1000)
//         .onUpdate(() => {
//             camera.position.set(coords.x, coords.y, coords.z);
//         })
//         .start();
//     });
//     interactionManager.add(d["siteObj"]);
// });

camera.position.set(siteObjects[6]["camPosSpace"].x, siteObjects[6]["camPosSpace"].y, siteObjects[6]["camPosSpace"].z);
// camera.position.y = 15;
// camera.position.z = 45;
//camera.rotation.x = Math.PI/2;

window.onkeydown= function(e){
    if(e.keyCode === 32){
        //console.log("space");
        sceneNum++;
        if(sceneNum > 14) {
            sceneNum = 1;
        }
        //console.log(sceneNum);
        //console.log(siteObjects[0]["camPosSky"].x);
        let coords;
        switch (sceneNum) {
            case 1:
                coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z};
                new TWEEN.Tween(coords)
                .to({x: siteObjects[0]["camPosSky"].x, y: siteObjects[0]["camPosSky"].y, z: siteObjects[0]["camPosSky"].z}, 1000)
                .onUpdate(() => {
                    camera.position.set(coords.x, coords.y, coords.z);
                })
                .start();
                break;
            case 2:
                coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z};
                new TWEEN.Tween(coords)
                .to({x: siteObjects[0]["camPosSpace"].x, y: siteObjects[0]["camPosSpace"].y, z: siteObjects[0]["camPosSpace"].z}, 1000)
                .onUpdate(() => {
                    camera.position.set(coords.x, coords.y, coords.z);
                })
                .start();
                break;
            case 3:
                coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z};
                new TWEEN.Tween(coords)
                .to({x: siteObjects[1]["camPosSky"].x, y: siteObjects[1]["camPosSky"].y, z: siteObjects[1]["camPosSky"].z}, 1000)
                .onUpdate(() => {
                    camera.position.set(coords.x, coords.y, coords.z);
                })
                .start();
                break;
            case 4:
                coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z};
                new TWEEN.Tween(coords)
                .to({x: siteObjects[1]["camPosSpace"].x, y: siteObjects[1]["camPosSpace"].y, z: siteObjects[1]["camPosSpace"].z}, 1000)
                .onUpdate(() => {
                    camera.position.set(coords.x, coords.y, coords.z);
                })
                .start();
                break;
            case 5:
                coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z};
                new TWEEN.Tween(coords)
                .to({x: siteObjects[2]["camPosSky"].x, y: siteObjects[2]["camPosSky"].y, z: siteObjects[2]["camPosSky"].z}, 1000)
                .onUpdate(() => {
                    camera.position.set(coords.x, coords.y, coords.z);
                })
                .start();
                break;
            case 6:
                coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z};
                new TWEEN.Tween(coords)
                .to({x: siteObjects[2]["camPosSpace"].x, y: siteObjects[2]["camPosSpace"].y, z: siteObjects[2]["camPosSpace"].z}, 1000)
                .onUpdate(() => {
                    camera.position.set(coords.x, coords.y, coords.z);
                })
                .start();
                break;
            case 7:
                coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z};
                new TWEEN.Tween(coords)
                .to({x: siteObjects[3]["camPosSky"].x, y: siteObjects[3]["camPosSky"].y, z: siteObjects[3]["camPosSky"].z}, 1000)
                .onUpdate(() => {
                    camera.position.set(coords.x, coords.y, coords.z);
                })
                .start();
                break;
            case 8:
                coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z};
                new TWEEN.Tween(coords)
                .to({x: siteObjects[3]["camPosSpace"].x, y: siteObjects[3]["camPosSpace"].y, z: siteObjects[3]["camPosSpace"].z}, 1000)
                .onUpdate(() => {
                    camera.position.set(coords.x, coords.y, coords.z);
                })
                .start();
                break;
            case 9:
                coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z};
                new TWEEN.Tween(coords)
                .to({x: siteObjects[4]["camPosSky"].x, y: siteObjects[4]["camPosSky"].y, z: siteObjects[4]["camPosSky"].z}, 1000)
                .onUpdate(() => {
                    camera.position.set(coords.x, coords.y, coords.z);
                })
                .start();
                break;
            case 10:
                coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z};
                new TWEEN.Tween(coords)
                .to({x: siteObjects[4]["camPosSpace"].x, y: siteObjects[4]["camPosSpace"].y, z: siteObjects[4]["camPosSpace"].z}, 1000)
                .onUpdate(() => {
                    camera.position.set(coords.x, coords.y, coords.z);
                })
                .start();
                break;
            case 11:
                coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z};
                new TWEEN.Tween(coords)
                .to({x: siteObjects[5]["camPosSky"].x, y: siteObjects[5]["camPosSky"].y, z: siteObjects[5]["camPosSky"].z}, 1000)
                .onUpdate(() => {
                    camera.position.set(coords.x, coords.y, coords.z);
                })
                .start();
                break;
            case 12:
                coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z};
                new TWEEN.Tween(coords)
                .to({x: siteObjects[5]["camPosSpace"].x, y: siteObjects[5]["camPosSpace"].y, z: siteObjects[5]["camPosSpace"].z}, 1000)
                .onUpdate(() => {
                    camera.position.set(coords.x, coords.y, coords.z);
                })
                .start();
                break;
            case 13:
                coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z};
                new TWEEN.Tween(coords)
                .to({x: siteObjects[6]["camPosSky"].x, y: siteObjects[6]["camPosSky"].y, z: siteObjects[6]["camPosSky"].z}, 1000)
                .onUpdate(() => {
                    camera.position.set(coords.x, coords.y, coords.z);
                })
                .start();
                break;
            case 14:
                coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z};
                new TWEEN.Tween(coords)
                .to({x: siteObjects[6]["camPosSpace"].x, y: siteObjects[6]["camPosSpace"].y, z: siteObjects[6]["camPosSpace"].z}, 1000)
                .onUpdate(() => {
                    camera.position.set(coords.x, coords.y, coords.z);
                })
                .start();
                break;
            default:
                console.log(`error`);
            }
        
    };
};

//Vector pointing towards the earth
let earthVec = new THREE.Vector3(0,0,0);

//Set position increments
var dx = .01;
var dy = .01;
var dz = -.05;

const animate = () => {
    //earth.rotation.y += .0009;

    // camera.position.x += dx;
    // camera.position.y += dy;
    // camera.position.z += dz;
    //camera.fov -= .1;
    //camera.updateProjectionMatrix();

    // //console.log(camera.position.z);
    // if (camera.position.z < -100) {
    // camera.position.set(0,35,70);
    // }

    camera.lookAt(earthVec);

    TWEEN.update();

    requestAnimationFrame( animate );

    renderer.render( scene, camera );
};

animate();
