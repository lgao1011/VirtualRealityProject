let rnd = (l,u) => Math.random() * (u-l) + l;

let scene, weapon, camera, portal;
let weaponDamage = 50;

let playerHealth = 100;
let maxHealth = 100;

let boost = 100;
let maxBoost = 100;

let boosting = false;

let boostStartThreshold = 10;
let boostStopThreshold = 0;

let basicEs = [];

let isGameOver = false;

let spawnZones = [
  { minX: 165, maxX: 175, minZ: -126, maxZ: -116 },
  { minX: 20, maxX: 50, minZ: -190, maxZ: -210 },
  { minX: 115, maxX: 141, minZ: -15, maxZ: -22 },
  { minX: 10, maxX: 40, minZ: 10, maxZ: 40 }
];

let enemiesKilled = 0;
let totalEnemies = 10;
let killText;

let caveMode = false;

let timer = 0;
let timerText;

window.addEventListener("DOMContentLoaded", function(){

  scene = document.querySelector("a-scene");

  killText = document.getElementById("killCounter");

  if(scene){

    scene.addEventListener("loaded", function(){

      camera = document.getElementById("mainCamera");
      portal = document.querySelector("#portalModel");

      console.log("Scene loaded");

      if (window.location.href.includes("caveexp")) {
          caveMode = true;

          killText = document.getElementById("killCounter");
          timerText = document.getElementById("timerText");

          startTimer();
      }

      for(let i = 0; i < 20; i++){

        let spawn = getValidSpawn();

        let enemy = new basicEnemy(spawn.x, 20, spawn.z, 150);
        basicEs.push(enemy);
      }

      for(let i = 0; i < 50; i++){
        let x = rnd(-100, 100);
        let z = rnd(-100, 100);
        let enemy = new basicEnemy(x, 20, z, 150);
        basicEs.push(enemy);
      }

      if (caveMode) {
        updateKillCounter();
      }

      setInterval(checkPortalDistance,200);

      window.addEventListener("keydown",function(e){

        if(e.key.toLowerCase()=="shift" && boost > boostStartThreshold){
          boosting = true;
        }

        if(e.key.toLowerCase()=="v"){
          camera.setAttribute("zoom","5");
        }

      });

      window.addEventListener("keyup",function(e){

        if(e.key.toLowerCase()=="shift"){
          boosting = false;
        }

        if(e.key.toLowerCase()=="v"){
          camera.setAttribute("zoom","1");
        }

      });

      window.addEventListener("keydown", function(e){

        if(e.key.toLowerCase() === "p") {

          let pos = camera.object3D.position;

          console.log("PLAYER POSITION:");
          console.log(`X: ${pos.x}`);
          console.log(`Y: ${pos.y}`);
          console.log(`Z: ${pos.z}`);
        }

      });

      loop();

    });

  }

});


function loop(){

  if (playerHealth <= 0) {
    gameOver();
  }

  let output = document.getElementById("output");

  if (output) {
    output.setAttribute(
      "value",
      `HP: ${Math.floor(playerHealth)}%\nBOOST: ${Math.floor(boost)}%`
    );
  }

  for(let enemy of basicEs){
    enemy.update();
    enemy.ended();
  }

  if (boosting) {

    boost -= .5;

    camera.setAttribute("wasd-controls", { acceleration: 500 });
    camera.setAttribute("zoom", ".75");

    if (boost <= boostStopThreshold) {
      boosting = false;
    }

  } else {

    camera.setAttribute("wasd-controls", { acceleration: 200 });
    camera.setAttribute("zoom", "1");

    if (boost < maxBoost) {
      boost += 0.3;
    }
  }

  boost = Math.max(0, Math.min(maxBoost, boost));

  window.requestAnimationFrame(loop);
}


function checkPortalDistance(){

  if(!camera || !portal) return;

  const camPos = new THREE.Vector3();
  const portalPos = new THREE.Vector3();

  camera.object3D.getWorldPosition(camPos);
  portal.object3D.getWorldPosition(portalPos);

  const dist = camPos.distanceTo(portalPos);

  if(dist <= 50){
    console.log("Entering cave map");
    window.location.href = "caveexp.html";
  }

}

function updateKillCounter() {
    if (!killText) return;

    if (caveMode) {
        killText.setAttribute("value", `Enemies Killed: ${enemiesKilled}`);
    } else {
        killText.setAttribute("value", `Enemies Killed: ${enemiesKilled}/${totalEnemies}`);
    }
}


function getValidSpawn() {

  let zone = spawnZones[Math.floor(Math.random() * spawnZones.length)];

  let x = rnd(zone.minX, zone.maxX);
  let z = rnd(zone.minZ, zone.maxZ);

  return { x, z };
}

function gameOver() {

    if (isGameOver) return;

    isGameOver = true;

    document.getElementById("gameOverScreen").style.display = "flex";

    if (camera) {
        camera.setAttribute("wasd-controls", "enabled: false");
    }

    console.log("GAME OVER");
}

function damagePlayer(amount) {
  playerHealth -= amount;

  if (playerHealth < 0) playerHealth = 0;

  console.log("Player HP:", playerHealth);
}

function startTimer() {

    setInterval(() => {

        timer++;

        if (timerText) {
            timerText.setAttribute("value", `Time: ${timer}`);
        }

    }, 1000);
}

function distance(obj1,obj2){

  let x1 = obj1.object3D.position.x;
  let y1 = obj1.object3D.position.y;
  let z1 = obj1.object3D.position.z;

  let x2 = obj2.object3D.position.x;
  let y2 = obj2.object3D.position.y;
  let z2 = obj2.object3D.position.z;

  return Math.sqrt(
    Math.pow(x1-x2,2) +
    Math.pow(y1-y2,2) +
    Math.pow(z1-z2,2)
  );

}