"use strict";

function createPricingForm() {
    return `
    <div class="row row-2">
        <h2>
            <p>PERSONAL TRAINING & MEMBERSHIP</p>
        </h2>

        <div class="col col-left">
            <img src="images/30min.jpg" class="card-img-top" alt="...">
                <div class="card-body">
                    <h3 class="card-title"></h3>
                    <p class="card-text text-start text-secondary"></p>
                </div>
        </div>
        <div class="col col-center">
            <img src="images/50min.jpg" class="card-img-top" alt="...">
                <div class="card-body">
                    <h3 class="card-title"></h3>
                    <p class="card-text text-start text-secondary"></p>
                </div>
        </div>
        <div class="col col-right">
            <img src="images/flfmembership.jpg" class="card-img-top" alt="...">
                <div class="card-body">
                    <h3 class="card-title"></h3>
                    <p class="card-text text-start text-secondary"></p>
                </div>
        </div>

    </div>
    `;
}

export { createPricingForm };

