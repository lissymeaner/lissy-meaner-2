// When the DOM is fully parsed (but before styles finish loading),
// run this async function so we can safely access elements and use await.
document.addEventListener("DOMContentLoaded", () => {
    // Add a submit event listener onto the contact form
    document.getElementById('contact-form').addEventListener('submit', async (e) => {
        // 1. Prevent the submit event from firing by default
        // // to check validation before the user can submit the form
        e.preventDefault();

        // 2. Store user-generated form data into an object called 'data';
        // // this object will be used by the backend for processing.
        const data = {
            firstName: document.querySelector('#first-name').value,
            lastName: document.querySelector('#last-name').value,
            email: document.querySelector('#email').value,
            subject: document.querySelector('#subject').value,
            message: document.querySelector('#body').value
        };

        // 3. Try to send the form data to the backend and handle its response.
        try {
            // // Debug if there has been any data sent.
            console.log("Form data sent:", data);
            // // Fetch the contact page, and the POST request made to it.
            const response = await fetch('http://localhost:3000/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            
            // // Assign text as response text from backend: either
            // // "Email sent successfully" or "Failed to send email".
            const text = await response.text();
            
            // // If the response was successful,
            if (response.ok) {
                // // alert the user that their email was sent succesfully.
                alert(text);
            } // // Or else, 
            else {
                // // alert the user that their message had not been sent,
                alert('Failed to send message.');
                // // then return an error message with the response text.
                console.error(text);
            }
        } // 4: Catch the error instead if there is an error in the process.
        catch (error) {
            // // Return an error message containing the error,
            console.error('Error:', error);
            // // and alert the user that an error occurred
            // // and they should try again.
            alert('An error occurred. Please try again later.');
        }
    });

    // 5: Switch buttons classes based on preferred colour scheme
    // // Assign boolean variable for whether if the user prefers the dark.
    let prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    
    // // Gather both buttons for directing the scroller
    const BUTTONS = document.querySelectorAll(".btn-light", ".btn-dark");
    
    console.log(BUTTONS);
    
    // // Update the button theme based on preferred colour scheme
    function updateButtonTheme(e) {
        BUTTONS.forEach(btn => {
            if (e.matches) {
                // Logic for switching to Dark mode
                btn.classList.remove("btn-light");
                btn.classList.add("btn-dark");
            } else {
                // Logic for switching to Light mode
                btn.classList.remove("btn-dark");
                btn.classList.add("btn-light");
            }
        });
    }

    // // Initial load by taking prefersDark as parameter
    updateButtonTheme(prefersDark);

    // // Watch for changes
    prefersDark.addEventListener("change", updateButtonTheme);
    //#endregion
});