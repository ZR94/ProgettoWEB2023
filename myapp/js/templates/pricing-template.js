"use strict";

function createPricingForm() {
    return `
    <div class="container">
        <div class="row">
            <div class="col-12">
                <h2 class="text-center mb-4">PERSONAL TRAINING & MEMBERSHIP</h2>
                <p class="text-center text-muted">*Based on 1-on-1 personal training sessions. Semi-private (2-3 clients): $10 off for each client. Must train at the same time to qualify.</p>
            </div>
        </div>

        <div class="row justify-content-center">
            <!-- 30-Min Sessions -->
            <div class="col-sm-12 col-md-4 mb-4 d-flex">
                <div class="pricing-card">
                    <h3 class="text-uppercase">30-min sessions</h3>
                    <p class="price">$78</p>
                    <p class="text-muted">/session</p>
                    <p class="text-muted">
                        $73/per session 2x per week<br>
                        $68/per session 3x per week<br>
                        $63/per session 4x per week
                    </p>
                </div>
            </div>

            <!-- 50-Min Sessions -->
            <div class="col-sm-12 col-md-4 mb-4 d-flex">
                <div class="pricing-card">
                    <h3 class="text-uppercase" style="color: #b59f4e;">50-min sessions</h3>
                    <p class="price">$108</p>
                    <p class="text-muted">/session</p>
                    <p class="text-muted">
                        $103/per session 2x per week<br>
                        $98/per session 3x per week<br>
                        $93/per session 4x per week
                    </p>
                    <p class="highlight text-warning">★ POPULAR</p>
                </div>
            </div>

            <!-- Membership -->
            <div class="col-sm-12 col-md-4 mb-4 d-flex">
                <div class="pricing-card">
                    <h3 class="text-uppercase">FLF membership</h3>
                    <p class="price">$88</p>
                    <p class="text-muted">/month</p>
                    <p class="text-muted">
                        Open gym hours<br>
                        Woodway treadmills<br>
                        Rogue equipment<br>
                        TRX equipment
                    </p>
                </div>
            </div>
        </div>

        <!-- Informazioni aggiuntive -->
        <div class="row mt-4">
            <div class="col-12">
                <p class="text-center text-muted">
                    Clients who train get 20% off open gym membership. Independent memberships to Fast Lean Fit are vetted and limited to 50 members per month only.
                    Members have access to open hours and Woodway treadmill, Rogue fitness equipment, free weights, TRX equipment, etc. for use.
                </p>
            </div>
        </div>
    </div>
    `;
}

export { createPricingForm };

