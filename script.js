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
  
    // For now we just log the data and show a simple success message.
    console.log("Username: " + username);
    console.log("Email: " + email);
    console.log("Password: " + password);
    alert("Registration successful! Welcome to Medibuddy.");
  });
  