import * as THREE from 'three'
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
const scene=new THREE.Scene();
const canvas=document.querySelector('.canvas');
const loadTexture=new THREE.TextureLoader();
const earthTexture=loadTexture.load("/2k_earth_daymap.jpg");
const marsTexture=loadTexture.load("/2k_mars.jpg")
const moonTexture=loadTexture.load("/2k_moon.jpg")
const neptuneTexture=loadTexture.load("/2k_neptune.jpg")
const sunTexture=loadTexture.load("/2k_sun.jpg")
const uranusTexture=loadTexture.load("/2k_uranus.jpg")
const mercuryTexture=loadTexture.load("/2k_mercury.jpg")
const venusTexture=loadTexture.load("/2k_venus_surface.jpg")
const jupiterTexture=loadTexture.load('/8k_jupiter.jpg')
const plutoTexture=loadTexture.load('/plutomapthumb.jpg')
const saturnTexture=loadTexture.load('/8k_saturn.jpg')
const sunMaterial=new THREE.MeshBasicMaterial();
const geometry=new THREE.SphereGeometry(1,32,32);
sunMaterial.map=sunTexture
scene.background=new THREE.CubeTextureLoader().setPath("public/cubemap/")
.load(
  ['nx.png',
  'nx.png',
  'py.png',
  'ny.png',
  'pz.png',
  'nz.png'
  ]
)
//planet Materials
const mercuryMaterial=new THREE.MeshStandardMaterial({
  map:mercuryTexture
})
const venusMaterial=new THREE.MeshStandardMaterial({
  map:venusTexture
})
const earthMaterial=new THREE.MeshStandardMaterial({
  map:earthTexture
})
const moonMaterial=new THREE.MeshStandardMaterial({
  map:moonTexture
})
const marsMaterial=new THREE.MeshStandardMaterial({
  map:marsTexture
})
const jupiterMaterial=new THREE.MeshStandardMaterial({
  map:jupiterTexture
})
const saturnMaterial=new THREE.MeshStandardMaterial({
  map:saturnTexture
})
const uranusMaterial=new THREE.MeshStandardMaterial({
  map:uranusTexture
})
const neptuneMaterial=new THREE.MeshStandardMaterial({
  map:neptuneTexture
})
const plutoMaterial=new THREE.MeshStandardMaterial({
  map:plutoTexture
})
const planets=[
  {
    name:'mercury',
    distance:2,
    material:mercuryMaterial,
    radius:0.5,
    speed:0.06,
    moons:[]
  },
  {
    name:'venus',
    distance:4,
    material:venusMaterial,
    radius:0.6,
    speed:0.055,
    moons:[]
  },
  {
  name:'earth',
  distance:6,
  material:earthMaterial,
  radius:0.7,
  speed:0.05,
  moons:[{
    name:'moon1',
    distance:2,
    material:moonMaterial,
    radius:0.2,
    speed:0.01
  }]
  },
  {
    name:'mars',
    distance:8,
    material:marsMaterial,
    radius:0.5,
    speed:0.035,
    moons:[]
  },
  {
    name:'jupiter',
    distance:10,
    material:jupiterMaterial,
    radius:0.8,
    speed:0.03,
    moons:[]
  },
  {
    name:'saturn',
    distance:12,
    material:saturnMaterial,
    radius:0.7,
    speed:0.05,
    moons:[]
  },
  {
    name:'uranus',
    distance:14,
    material:uranusMaterial,
    radius:0.7,
    speed:0.06,
    moons:[]
  },
  {
    name:'neptune',
    distance:15,
    material:neptuneMaterial,
    radius:0.7,
    speed:0.04,
    moons:[]
  },
  {
    name:'pluto',
    distance:17,
    material:plutoMaterial,
    radius:0.5,
    speed:0.045,
    moons:[]
  }
]
const sunMesh=new THREE.Mesh(geometry,sunMaterial);
sunMesh.scale.setScalar(1);
scene.add(sunMesh);
// console.log(sunMesh)
const array=planets.map((planet)=>{
  //create the mesh
  const planetMesh=new THREE.Mesh(
    geometry,planet.material
  )
  // console.log(planetMesh.material)
  planetMesh.scale.setScalar(planet.radius-0.2);
  planetMesh.position.x=planet.distance
  //create mons if present
  planet.moons.forEach((moon)=>{
    const moonMesh=new THREE.Mesh(geometry,moonMaterial)
    moonMesh.scale.setScalar(moon.radius);
    // moonMesh.scale.setScalar(moon.radius);
    moonMesh.position.x=moon.distance
    planetMesh.add(moonMesh);
    return moonMesh;
  })
  scene.add(planetMesh);
  return planetMesh;
})
const light=new THREE.AmbientLight('white',0.5)
scene.add(light)
const pointLight=new THREE.PointLight('white',70);
scene.add(pointLight)
const camera=new THREE.PerspectiveCamera(35,window.innerWidth/window.innerHeight,0.1,400);
const renderer=new THREE.WebGLRenderer({
  canvas:canvas,
  antialias:true
})
const controls=new OrbitControls(camera,canvas);
controls.enableDamping=true;
camera.position.z=5;
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,1));
window.addEventListener('resize',()=>{
  controls.update();
  // camera.aspect=window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth,window.innerHeight);
})
console.log(array)
// const clock =new THREE.Clock();
const renderLoop=()=>{
  // const elapsedTime=new clock.elapsedTime();
  //based on when the next frame is going to start we rotate the cube
  controls.update();
  // animating the planets which are stored in array
  array.forEach((planet,index)=>{
    planet.rotation.y+=planets[index].speed-0.0442;
    planet.position.x=Math.sin(planet.rotation.y)*planets[index].distance;
    planet.position.z=Math.cos(planet.rotation.y)*planets[index].distance;
    planet.addEventListener('mouseover',(e)=>{
      console.log(planet.name)
    })
    planet.children.forEach((moon,ind)=>{
      moon.rotation.y+=planets[index].moons[ind].speed;
      moon.position.x=Math.sin(moon.rotation.y)*planets[index].moons[ind].distance;
      moon.position.z=Math.cos(moon.rotation.y)*planets[index].moons[ind].distance;
    })
  })
  renderer.render(scene,camera);
  requestAnimationFrame(renderLoop);
}
renderLoop();