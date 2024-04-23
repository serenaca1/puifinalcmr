import * as THREE from "/three";
import {OrbitControls} from "/three/examples/jsm/controls/OrbitControls.js";
import {GLTFLoader} from "/three/examples/jsm/loaders/GLTFLoader.js";
import gsap from '/gsap';

//find column wdith


//renderer
function checkscreensize(){
  if(window.innerWidth<=1370){
    return 0.9
  }
  else{
    return 0.69
  }
}
var rendersizew=window.innerWidth*checkscreensize();
var rendersizeh=window.innerHeight*checkscreensize();
const renderer = new THREE.WebGLRenderer();
renderer.autoClear = false;
renderer.shadowMap.enabled=true;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(rendersizew, rendersizeh);

//document.body.appendChild(renderer.domElement);
var container = document.getElementById( 'carscene' ); 
container.appendChild( renderer.domElement );
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x131416);
const buttonscene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth/window.innerHeight,
    0.01,
    2000
)

camera.position.set(8.7,2.6,3.9);//default pos


//orbit controls
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableZoom=true;
orbit.maxDistance=20;
orbit.minDistance=3;
orbit.maxPolarAngle=Math.PI/2.2;

//check for camera pos in console 
//orbit.addEventListener( "change", event => {  
  //console.log( orbit.object.position ); 
//} )

const fov = 50;
const planeAspectRatio = 16 / 9;

window.addEventListener('resize', resize)
function resize() {

  // update the size
  renderer.setSize(window.innerWidth*checkscreensize(), window.innerHeight*checkscreensize());

  // update the camera
  const canvas = renderer.domElement
  camera.aspect = canvas.clientWidth/canvas.clientHeight
  camera.updateProjectionMatrix()
}

//lighting
const ambientLight = new THREE.AmbientLight(0x333333);
ambientLight.intensity = 10;
var light = new THREE.DirectionalLight( 0xffffff, 1 );
scene.add(light);
scene.add(ambientLight);
orbit.addEventListener( 'change', light_update );

function light_update()
{
    light.position.copy( camera.position );
}


const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
scene.add(directionalLight);
directionalLight.position.set=(5.6,3.2,-2.6);
directionalLight.castShadow=true;
directionalLight.intensity = 4;


//sprite buttons 


const map = new THREE.TextureLoader().load( 'carbutton.svg' );
const material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
function createButton(map,material,x,y,z,name){
  const sprite = new THREE.Sprite(material);
  sprite.position.set(x,y,z);
  sprite.scale.set(0.2,0.2,1);
  sprite.sizeAttenuation=false;
  sprite.name=name;
  return sprite;
  
}
const buttons=new THREE.Group();
buttons.add(createButton(map,material,3,0.7,0,'nosecone'));
buttons.add(createButton(map,material,0.5,0.2,1.4,'diffuser'));
buttons.add(createButton(map,material,1.8,0.4,1.5,'powertrain'));
buttons.add(createButton(map,material,2,0.5,-0.7,'control arms'));
buttons.add(createButton(map,material,1.4,0.9,0,'dashboard'));
buttons.add(createButton(map,material,1,0.85,0,'steering'));
buttons.add(createButton(map,material,0.4,0.3,0,'seat'));
buttons.add(createButton(map,material,0.4,0.7,0.7,'chassis'));
buttonscene.add(buttons);

//sprite = new THREE.Sprite(spriteMaterial);
//scene.add(sprite);
//find screen coords
//console.log(screenXY(buttonscene.getObjectByName("nosecone")));

//car loader 
const carloader = new GLTFLoader();
carloader.load("public/CMR.glb",function(gltf){
    gltf.scene.scale.set(0.2, 0.2, 0.2); const model=gltf.scene;
    model.position.set(0,0,0);
    scene.add(model);
    
    model.castShadow=false;
    scene.traverse(function(obj) {//clones each mesh so each one is unique (for opacity changes to work
      if (obj.type == 'Mesh') {
        var newcar = obj.clone();
        obj.material=newcar.material.clone();
      }
    } );

    console.log("loadedcar");
  },
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
)


//animate
function animate(){
  //resize();
  orbit.update();
  renderer.clear();
  renderer.render( scene, camera );
  renderer.clearDepth();
  renderer.render( buttonscene, camera );
  //raycaster.setFromCamera(coords, camera);
}
renderer.setAnimationLoop(animate);



//raycaster
const raycaster = new THREE.Raycaster();
document.addEventListener('mousedown', onMouseDown);
function onMouseDown(event) {
  var canvasBounds = renderer.domElement.getBoundingClientRect();
  const coords = new THREE.Vector2(
    ( ( event.clientX - canvasBounds.left ) / ( canvasBounds.right - canvasBounds.left ) ) * 2 - 1,
    - ( ( event.clientY - canvasBounds.top ) / ( canvasBounds.bottom - canvasBounds.top) ) * 2 + 1,
  );

  raycaster.setFromCamera(coords, camera);
  const intersections = raycaster.intersectObjects(buttonscene.children, true);
  if (intersections.length > 0) {
    const selectedObject = intersections[0].object;
    console.log(`${selectedObject.name}`);
    scene.traverse(function(obj) {
      if (obj.type == 'Mesh') {
        obj.material.transparent = true;
        obj.material.opacity = 0.1; 
      }
    } );
    if("powertrain"==`${selectedObject.name}`){
      powertrain();
    }
    if("control arms"==`${selectedObject.name}`){
      controlarms();
    }
    if("dashboard"==`${selectedObject.name}`){
      dashboard();
    }

    if("nosecone"==`${selectedObject.name}`){
      nosecone();
    }
    if("diffuser"==`${selectedObject.name}`){
      diffuser();
    }
    if("steering"==`${selectedObject.name}`){
      steering();
    }
    if("seat"==`${selectedObject.name}`){
      seat();
    }
    if("chassis"==`${selectedObject.name}`){
      chassis();
    }
  }
}

//BUTTON FUNCTIONS
document.getElementById("back").addEventListener("click", backFull);
function resettxtcam(){
    for(let i=0;i<Object.keys(parts).length;i++){
  
      var circle = document.getElementById(i);
      if(circle.innerHTML!='<img style="width:0.75em;" src="public/circleempty.svg"/>'){
          circle.innerHTML='<img style="width:0.75em;" src="public/circleempty.svg"/>';
      }
      
  
  }
  document.getElementById("heading").innerHTML="24E INFORMATION";
  document.getElementById("bodytxt").innerHTML="Learn more about 24E.";
  //document.getElementById("partname").innerHTML=" ‎ ";
  //document.getElementById("sectionname").innerHTML=" ‎ ";
  gsap.to(camera.position,{x:8.7,y:2.6,z:3.9,duration:1.0});
  scene.traverse(function(obj) {
    if (obj.type == 'Mesh') {
      obj.material.opacity = 1.0; 
    }
  } );
  buttonscene.add(buttons);
  //buttonscene.traverse(function(sprite){
   //console.log("sharted");
    //sprite.visible=true;     
  //});
  orbit.maxDistance=20;
  orbit.minDistance=3;

}
function backFull(){
  document.getElementById("back").innerHTML="";
  resettxtcam()

}
function findkeyindex(name){
  for(let i=0;i<Object.keys(parts).length;i++){
    name=name.replace(/\s/g, "");
    var part=Object.keys(parts)[i];
    part=part.replace(/\s/g, "");
    if(name==part){
      return i;
    }
  }
  return 0;
}
function buttonclicked(x,y,z,name,part){
  gsap.to(camera.position,{x:x,y:y,z:z,duration:1});
  zoomall()
  console.log(findkeyindex(name));
  buttonclickchangecircle(findkeyindex(name));
  document.getElementById("heading").innerHTML=name;
  var parttxt=name;
  parttxt=parttxt.trim();
  parttxt=String(parttxt);
  document.getElementById("bodytxt").innerHTML=parts[parttxt];
  //document.getElementById("partname").innerHTML=name;
  //document.getElementById("sectionname").innerHTML=checksection(part);
  buttonscene.traverse(function(sprite){
      buttonscene.remove(sprite);
      //sprite.visible=false;     
  });
  
}
function checksection(name){
  if(name.includes("POWER")){
    return "POWERTRAIN";
  }  
  if(name.includes("DRIVER")){
    return "DRIVER INTERFACE";
  }
  if(name.includes("AERO")){
    return "AERODYNAMICS";
  }
  if(name.includes("POWERTRAIN")){
    return "POWERTRAIN";
  }
  if(name.includes("SUSPENSION")){
    return "SUSPENSION";
  }
  else{
    return "24E";
  } 
}
function zoomall(){
  console.log("backed");
  document.getElementById("back").innerHTML='<img src="public/back.svg" alt = "back button"/>';
  orbit.maxDistance=5;
  orbit.minDistance=2;
}



//left & right rotate 
document.getElementById("left").addEventListener("click", leftturn);
document.getElementById("right").addEventListener("click", rightturn);
//document.getElementById("right").addEventListener("click", rightturn);

var axis = new THREE.Vector3(0, 1, 0);
var step = Math.PI * 0.2;

function leftturn() {
  var camposview = new THREE.Vector3();
  camposview.copy(camera.position);
  console.log(camposview);
  console.log(camposview.applyAxisAngle(axis, step));
  gsap.to(camera.position,{x:camposview.x,y:camposview.y,z:camposview.z,duration:0.6});
}
function rightturn() {
  var camposview = new THREE.Vector3();
  camposview.copy(camera.position);
  console.log(camposview);
  console.log(camposview.applyAxisAngle(axis, -step));
  gsap.to(camera.position,{x:camposview.x,y:camposview.y,z:camposview.z,duration:0.6});
}



//CARS
function powertrain(){
  buttonclicked(2.34403539746252,0.5142122858256497,2.7011689825184537, "powertrain","_24E-VEHICLE-FULL_ASSEMBLY_STEP_ASMSTEP_-__PT24-POWERTRAIN385");
  scene.traverse(function(obj){
    var objname=obj.name;
    if(objname.includes("POWERTRAIN")){
      console.log("powertrain scene traverse")
      obj.material.opacity = 1.0; 
    }
  });
  var wheel = scene.getObjectByName("_24E-VEHICLE-FULL_ASSEMBLY_STEP_ASMSTEP_-__PT24-POWERTRAIN385");
  wheel.material.opacity=0.1;
  wheel = scene.getObjectByName("_24E-VEHICLE-FULL_ASSEMBLY_STEP_ASMSTEP_-__PT24-POWERTRAIN102");
  wheel.material.opacity=0.1;      
  wheel = scene.getObjectByName("_24E-VEHICLE-FULL_ASSEMBLY_STEP_ASMSTEP_-__PT24-POWERTRAIN687");
  wheel.material.opacity=0.1;
  wheel = scene.getObjectByName("_24E-VEHICLE-FULL_ASSEMBLY_STEP_ASMSTEP_-__PT24-POWERTRAIN281");
  wheel.material.opacity=0.1;
}
function controlarms(){
  var part=scene.getObjectByName("_24E-VEHICLE-FULL_ASSEMBLY_STEP_ASMSTEP_-__SS24-SUSPENSION289");
  buttonclicked(2.9802484654190935,3.5702647859350605,0.6900676841564807, "control arms",part.name);
  console.log(part);
  part.material.opacity = 1.0;  
}
function dashboard(){
  scene.traverse(function(obj){
      var objname=obj.name;
      if(objname.includes("DRIVER")){
        console.log(obj.name);
        console.log(obj.material);
        if (obj.type == 'Mesh') {
          obj.material.opacity = 1.0; 
        }
      }
    });
    var mono = scene.getObjectByName("_24E-VEHICLE-FULL_ASSEMBLY_STEP_ASMSTEP_-__DI24-DRIVER_INTERFA_1");
    mono.material.opacity=0.1;
    buttonclicked(-2,3.69,2.6, "dashboard",mono.name);

}
function nosecone(){
  var part=scene.getObjectByName("_24E-VEHICLE-FULL_ASSEMBLY_STEP_ASMSTEP_-__AE24_AERODYNAMI030");
  console.log(part);
  buttonclicked(4.6484901948310755, 1.027569136597298,0.40993750101750476,"nosecone", part.name);
  part.material.opacity = 1.0;  
}

function diffuser(){
  var part=scene.getObjectByName("_24E-VEHICLE-FULL_ASSEMBLY_STEP_ASMSTEP_-__AE24_AERODYNAMI108");
  console.log(part);
  buttonclicked(0.8136400889323839, 1.320065874591887, 3.7148286612454413, "diffuser", part.name);
  part.material.opacity = 1.0;  
}
function steering(){
  var part=scene.getObjectByName("_24E-VEHICLE-FULL_ASSEMBLY_STEP_ASMSTEP_-__DI24-DRIVER_INT042");
  buttonclicked(-0.4, 3.4, 1, "steering",part.name);
  part.material.opacity = 1.0;  
}
function seat(){
  var part=scene.getObjectByName("_24E-VEHICLE-FULL_ASSEMBLY_STEP_ASMSTEP_-__DI24-DRIVER_INT207_1");
  console.log(part);
  console.log(part.position);

  buttonclicked(1.8889922144666458, 2.251717059663871, 0.6012309846499021, "seat",part.name);
  part.material.opacity = 1.0;  

}
function chassis(){
  var part=scene.getObjectByName("_24E-VEHICLE-FULL_ASSEMBLY_STEP_ASMSTEP_-__DI24-DRIVER_INTERFA_1");
  console.log(part);
  buttonclicked(4, 1.94, -2.16, "chassis",part.name);
  part.material.opacity = 1.0;  

}

//keyboard button 

function executeFunctionByName(functionName, context ) {
  var args = Array.prototype.slice.call(arguments, 2);
  var namespaces = functionName.split(".");
  var func = namespaces.pop();
  for(var i = 0; i < namespaces.length; i++) {
    context = context[namespaces[i]];
  }
  return context[func].apply(context, args);
}

document.getElementById("nextbutton").addEventListener("click", (evt)=>buttonclicknext(checkcurrentpos(),evt));
document.getElementById("backbutton").addEventListener("click", (evt)=>buttonclickback(checkcurrentpos(),evt));
function checkcurrentpos(){
  var position=document.getElementById("heading").textContent;
  return findkeyindex(position);
  
}
function buttonclicknext(num,evt){
  num=numloopadd(num);
  clickcircle(num,evt);
  var partname = Object.keys(parts)[num];
  partname=partname.replace(/\s/g, "");
  console.log(partname);
  eval(`${partname}`+"()");
  return num;
  
}
function buttonclickback(number,evt){
  var num=numloopsub(number);
  clickcircle(num,evt);
  var partname = Object.keys(parts)[num];
  partname=partname.replace(/\s/g, "");
  console.log(partname);
  eval(`${partname}`+"()");
  return num;
}

//adding circles
var circlesdiv=document.getElementById("circles");
console.log(document.getElementById("circles"));
for(let i=0;i<Object.keys(parts).length;i++){
    console.log("poopiee");
    var thiscircle = '<span class="dot" id="'+i+'"><img style="width:0.75em;"src="public/circleempty.svg"/></span>';
    thiscircle=String(thiscircle);
    console.log(thiscircle);
    circlesdiv.insertAdjacentHTML("beforeend",thiscircle);
    document.getElementById(i).addEventListener("click",(evt)=>clickcircle(i,evt));
    console.log(document.getElementById("circles").innerHTML);

}
function clickcircle(i,evt){
  scene.traverse(function(obj) {
    if (obj.type == 'Mesh') {
      obj.material.transparent = true;
      obj.material.opacity = 0.1; 
    }
  } );
  console.log(i);
  var circle = document.getElementById(i);
  circle.innerHTML='<img style="width:0.75em;" src="public/circlered.svg"/>';
  clearothercircle(i);
  var partname=Object.keys(parts)[i].replace(/\s/g, "");
  console.log(partname);
  eval(`${partname}`+"()");
}
function buttonclickchangecircle(i){
  console.log(i);
  var circle = document.getElementById(i);
  circle.innerHTML='<img style="width:0.75em;" src="public/circlered.svg"/>';
  clearothercircle(i);
  var partname=Object.keys(parts)[i].replace(/\s/g, "");
  console.log(partname);
}
function clearothercircle(clickedcirclenumber){
  for(let i=0;i<Object.keys(parts).length;i++){
    if(i!=clickedcirclenumber){
      var circle = document.getElementById(i);
      if(circle.innerHTML!='<img style="width:0.75em;" src="public/circleempty.svg"/>'){
          circle.innerHTML='<img style="width:0.75em;" src="public/circleempty.svg"/>';
      }
    }

}
}
