import * as THREE from 'https://cdn.skypack.dev/three@0.133.1';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/controls/OrbitControls.js';

let earthradius = 5;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize( window.innerWidth, window.innerHeight );
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

const colors = [0xcc66ff, 0xffff66, 0xffff99, 0x0099ff, 0xff5050, 0xff9900, 0x00cc00];

//console.log(sats);

const earth = new THREE.Mesh( 
    new THREE.SphereGeometry(earthradius, 50, 50), 
    new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load("../assets/img/globe.jpeg"),
        bumpMap: new THREE.TextureLoader().load("../assets/img/globebump.jpeg"),
        color: 0xaaaaaa,
        specular: 0x333333,
        shininess: 25
    })
);
scene.add( earth );

let satellite = (xco, yco, zco, size, color) => {
    let sat = new THREE.Mesh(
        new THREE.SphereGeometry(size, 50, 50), 
        new THREE.MeshBasicMaterial({
            color: color
        }));
    sat.position.set(xco, yco, zco);
    scene.add(sat);
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
    satellite(sats[i][0], 0, sats[i][1], 0.2, color);
};

let mapLatLon = (lat, lon) => {
    let phi   = (90-lat)*(Math.PI/180);
    let theta = (lon+180)*(Math.PI/180);
    let x = -((earthradius) * Math.sin(phi)*Math.cos(theta));
    let z = ((earthradius) * Math.sin(phi)*Math.sin(theta));
    let y = ((earthradius) * Math.cos(phi));

    let pos = new THREE.Vector3(x, y, z);
    return pos;
}

for (let i = 1; i < sites.length; i++) {
    let lat = parseFloat(sites[i][1]);
    let lon = parseFloat(sites[i][2]);

    let pos = mapLatLon(lat, lon);

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

    satellite(pos.x, pos.y, pos.z, 0.1, color);
};

//camera.position.y = -15;
camera.position.z = 70;
//camera.rotation.x = Math.PI/2;

//Vector pointing towards the earth
var earthVec = new THREE.Vector3(0,0,0);

//Set position increments
var dx = .01;
var dy = .01;
var dz = -.05;

const animate = () => {
    //earth.rotation.y += .0009;

    camera.position.x += dx;
    camera.position.y += dy;
    camera.position.z += dz;

    //console.log(camera.position.z);
    if (camera.position.z < -100) {
    camera.position.set(0,35,70);
    }

    camera.lookAt(earthVec);

    requestAnimationFrame( animate );

    renderer.render( scene, camera );
};

animate();
