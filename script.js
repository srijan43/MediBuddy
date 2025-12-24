document.getElementById("registration-form").addEventListener("submit", function(event) {
    event.preventDefault();
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirm-password").value;
  
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
  
    // Here, you can add code to send the registration data to the server or perform any other necessary actions.
    // For demonstration purposes, we're simply logging the data to the console.
    console.log("Username: " + username);
    console.log("Email: " + email);
    console.log("Password: " + password);
  });
  