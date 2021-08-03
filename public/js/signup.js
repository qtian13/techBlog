const signupFormHandler = async (event) => {
    console.log("signing up starts");
    event.preventDefault();

    console.log("signing up starts");

    // collect values from the signup form
    const username = document.querySelector('#username-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    console.log("username: " + username);
    console.log("password: " + password);
    if (username && password) {
        // send a POST request to the API endpoint
        const response = await fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json'},
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
    }
};

console.log("i am here");

document
  .querySelector('.signup-form')
  .addEventListener('submit', signupFormHandler);