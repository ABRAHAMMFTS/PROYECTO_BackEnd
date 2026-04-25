// Abrir signup
document.getElementById("showformSignup").addEventListener("click", function () {
    const container = document.getElementById("signup-container");
    const form = document.getElementById("signupFormContainer");

    container.classList.add("show");
    form.style.display = "flex";
});

// Cerrar signup
document.getElementById("signupCutButton").addEventListener("click", function () {
    const container = document.getElementById("signup-container");
    const form = document.getElementById("signupFormContainer");

    container.classList.remove("show");
    form.style.display = "none";
});