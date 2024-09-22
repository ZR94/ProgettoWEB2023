"use strict";

function createHomeForm() {
    return `
    <div class="row row-1">
      <h1>
        <p>FITNESS</p> <p>REBORN</p>
      </h1>
    </div>

    <!-- Sezione Introduttiva con Metodo FLF -->
    <div class="container text-center">
        <div class="row row-2 justify-content-center">
            <h2 class="mb-4">INTRODUCING THE FLF METHOD</h2>
            <div class="row justify-content-center">
                <div class="col-md-4 mb-4 d-flex justify-content-center">
                    <div class="card border-0 h-100 shadow card-home">
                        <img src="images/image_fast.jpg" class="card-img-top img-fluid" alt="BURN MORE, LESS TIME">
                        <div class="card-body">
                            <h3 class="card-title">BURN MORE, LESS TIME</h3>
                            <p class="card-text text-secondary">For the maximum burn in the shortest time, we do interval training by incorporating HIlT (high-intensity interval training) HIIT combines intense, 
                            high-energy bursts of activity with short periods of lower-energy activity, followed by a cool-down. It's a scientifically proven method that increases your basal metabolic rate known as the 'afterburn effect.' 
                            This conditions your body to burn calories AND fat for the 24 hours following the workout.</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-4 d-flex justify-content-center">
                    <div class="card border-0 h-100 shadow card-home">
                        <img src="images/image-lean.jpeg" class="card-img-top img-fluid" alt="MOTION NOT MACHINES">
                        <div class="card-body">
                            <h3 class="card-title">MOTION NOT MACHINES</h3>
                            <p class="card-text text-secondary">In sports, you're never on your feet at the same time. Our 3-dimensional training makes you balance, jump, sprint, push, pull, rotate, move laterally side-to-side, 
                            and simultaneously engage all your core muscles. Our studio emphasizes compound exercising using weights, kettlebells, battle ropes, resistance bands and other training equipment. 
                            Compound exercises activate multiple muscle groups, reshaping your composition and giving you that toned, sculpted body.  </p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-4 d-flex justify-content-center">
                    <div class="card border-0 h-100 shadow card-home">
                        <img src="images/image_fit.jpeg" class="card-img-top img-fluid" alt="FITNESS RULES REBORN">
                        <div class="card-body">
                            <h3 class="card-title">FITNESS RULES REBORN</h3>
                            <p class="card-text text-secondary">The Fast Lean Fit™ method is a full-body, functional workout based on a sport-specific training approach. We design our sequences the right way to give you the best workout. 
                            These sequences help improve movement & stability, strength & endurance,  and flexibility & balance. Rules on how to train well and properly makes all the difference. Our corrective exercises realigns your posture 
                            and prevent you from injury and wasting time on ineffective workouts.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Sezione Galleria di Immagini -->
    <div class="container mt-5">
        <div class="row row-3 justify-content-center">
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4 justify-content-center">
                <div class="col d-flex justify-content-center">
                    <div class="card h-100 shadow">
                        <img src="images/prova 1.jpeg" class="card-img-top img-fluid" alt="fitness-1">
                    </div>
                </div>
                <div class="col d-flex justify-content-center">
                    <div class="card h-100 shadow">
                        <img src="images/prova 2.jpeg" class="card-img-top img-fluid" alt="fitness-2">
                    </div>
                </div>
                <div class="col d-flex justify-content-center">
                    <div class="card h-100 shadow">
                        <img src="images/prova 3.jpeg" class="card-img-top img-fluid" alt="fitness-3">
                    </div>
                </div>
                <div class="col d-flex justify-content-center">
                    <div class="card h-100 shadow">
                        <img src="images/prova 4.jpeg" class="card-img-top img-fluid" alt="fitness-4">
                    </div>
                </div>
                <div class="col d-flex justify-content-center">
                    <div class="card h-100 shadow">
                        <img src="images/prova 5.jpeg" class="card-img-top img-fluid" alt="fitness-5">
                    </div>
                </div>
                <div class="col d-flex justify-content-center">
                    <div class="card h-100 shadow">
                        <img src="images/prova 6.jpeg" class="card-img-top img-fluid" alt="fitness-6">
                    </div>
                </div>
                <div class="col d-flex justify-content-center">
                    <div class="card h-100 shadow">
                        <img src="images/prova 7.jpeg" class="card-img-top img-fluid" alt="fitness-7">
                    </div>
                </div>
                <div class="col d-flex justify-content-center">
                    <div class="card h-100 shadow">
                        <img src="images/prova 8.jpeg" class="card-img-top img-fluid" alt="fitness-8">
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row row-4">
      <h1>
        <p>WORLD</p> <p>CLASS</p> <p>TRAINING</p>
      </h1>
    </div>

    <div class="row row-5">
      
      <h2>
        <p>WHAT WE DO</p>
      </h2>

      <div class="row sub-row-5-0 list-bar">
        <div class="col">
          <ul class="list-group-1">
            <li >FAT LOSS</li>
            <li >BUILDING MUSCLE</li>
            <li >TONING & SCULPTING</li>
            <li >METABOLIC CONDITIONG</li>
          </ul>
        </div>
        <div class="col">
          <ul class="list-group-2">
            <li >SPEED, AGILITY & POWER</li>
            <li >SPORTS PHYSICAL THERAPY</li>
            <li >FUNCTIONAL TRAINING</li>
            <li >CORRECTIVE EXERCISE</li>
          </ul>
        </div>
        <div class="col">
          <ul class="list-group-3">
            <li >MASSAGE THERAPY</li>
            <li >PHYSICAL THERAPY</li>
            <li >SPORTS SPECIFIC</li>
            <li >TRAINING</li>
          </ul>
        </div>
      </div>

    </div>

  </div>
    `;
}

export {createHomeForm};