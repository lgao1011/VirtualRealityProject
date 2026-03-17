let rnd = (l,u) => Math.random() * (u-l) + l;

let scene, weapon, camera, portal;
let weaponDamage = 50;

let basicEs = [];


window.addEventListener("DOMContentLoaded", function(){

  scene = document.querySelector("a-scene");

    if(scene){

        // wait for A-Frame to finish loading
            scene.addEventListener("loaded", function(){

                  camera = document.getElementById("mainCamera");
                        portal = document.querySelector("#portalModel");

                              console.log("Scene loaded");

                                    // spawn enemies
                                          for(let i = 0; i < 10; i++){
                                                  let x = rnd(-10,10);
                                                          let z = rnd(-10,10);

                                                                  let enemy = new basicEnemy(x,2,z,150);
                                                                          basicEs.push(enemy);
                                                                                }

                                                                                      // portal check
                                                                                            setInterval(checkPortalDistance,200);

                                                                                                  // movement controls
                                                                                                        window.addEventListener("keydown",function(e){

                                                                                                                if(e.key.toLowerCase()=="shift"){
                                                                                                                          camera.setAttribute("wasd-controls",{acceleration:500});
                                                                                                                                    camera.setAttribute("zoom",".75");
                                                                                                                                            }

                                                                                                                                                    if(e.key.toLowerCase()=="v"){
                                                                                                                                                              camera.setAttribute("zoom","5");
                                                                                                                                                                      }

                                                                                                                                                                            });

                                                                                                                                                                                  window.addEventListener("keyup",function(e){

                                                                                                                                                                                          if(e.key.toLowerCase()=="shift"){
                                                                                                                                                                                                    camera.setAttribute("wasd-controls",{acceleration:100});
                                                                                                                                                                                                              camera.setAttribute("zoom","1");
                                                                                                                                                                                                                      }

                                                                                                                                                                                                                              if(e.key.toLowerCase()=="v"){
                                                                                                                                                                                                                                        camera.setAttribute("zoom","1");
                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                      });

                                                                                                                                                                                                                                                            loop();

                                                                                                                                                                                                                                                                });

                                                                                                                                                                                                                                                                  }

                                                                                                                                                                                                                                                                  });


                                                                                                                                                                                                                                                                  function loop(){

                                                                                                                                                                                                                                                                    for(let enemy of basicEs){
                                                                                                                                                                                                                                                                        enemy.update();
                                                                                                                                                                                                                                                                            enemy.ended();
                                                                                                                                                                                                                                                                              }

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