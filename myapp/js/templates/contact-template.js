function createContactForm() {
    return `
    <div class="container mt-5">
        <!-- Titolo principale -->
        <div class="row mb-5">
            <div class="col text-center">
                <h1 class="contact-title">Contact</h1>
            </div>
        </div>

        <!-- Sezione Contatti -->
        <div class="row">
            <!-- Colonna sinistra: Call ed Email -->
            <div class="col-md-6 mb-4">
                <div class="contact-section">
                    <h3 class="contact-subtitle">CALL</h3>
                    <p class="contact-info">(213) 393-3282</p>
                </div>

                <div class="contact-section">
                    <h3 class="contact-subtitle">EMAIL</h3>
                    <p class="contact-info">dan@fastleanfit.com</p>
                </div>
            </div>

            <!-- Colonna destra: Location -->
            <div class="col-md-6 mb-4">
                <div class="contact-section">
                    <h3 class="contact-subtitle">LOCATION</h3>
                    <p class="contact-info">
                        <strong>Koreatown</strong><br>
                        3223 W. 6th St. #1-96<br>
                        Los Angeles, CA 90020
                    </p>
                </div>

                <!-- Mappa -->
                <div class="map-responsive">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3302.718134645142!2d-118.2994226849037!3d34.06233398060653!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2b9375a8b7d7b%3A0x7b1a1b903546e65d!2s3223%20W%206th%20St%2C%20Los%20Angeles%2C%20CA%2090020%2C%20USA!5e0!3m2!1sen!2sus!4v1621547585631!5m2!1sen!2sus" 
                    width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
                </div>
            </div>
        </div>
    </div>
    `;
}

export { createContactForm };