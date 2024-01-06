/*
This code adds an event listener to a button with the ID 'getLocationBtn'.
When the button is clicked, it requests the user's confirmation before
attempting to access their geolocation.

To use it there is an example of code in html:
  <button id="getLocationBtn">Get localisation</button>
  <script src="localisation.js"></script>
*/

document.getElementById('getLocationBtn').addEventListener('click', () => {
    // Ask for confirmation before requesting geolocation
    // because before, when you allowed it one time, it don't ask again
    const userConfirmation = confirm("This website wants to access your location. Do you allow it?");

    if (userConfirmation) {
        // Check if the browser supports geolocation
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                // If it's a success
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    // show the location in the console
                    //console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

                    // Open a new tab with Google Maps showing the user's location thanks to is latitude and longitude
                    window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
                },
                // Error + error message in the console
                (error) => {
                    console.error('Geolocation error:', error.message);
                }
            );
        } else {
            //if the browser don't support the API, show this message in the console:
            console.error('Geolocation is not supported by this browser.');
        }
    } else {
        //if the user denied the geolocation request, show this message in the console:
        console.log('User denied geolocation request.');
    }
});
