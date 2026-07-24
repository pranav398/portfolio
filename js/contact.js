const PUBLIC_KEY = "<YOUR_PUBLIC_KEY>";
const SERVICE_ID = "<YOUR_SERVICE_ID>";
const TEMPLATE_ID = "<YOUR_TEMPLATE_ID>";

emailjs.init(PUBLIC_KEY);

const form = document.getElementById("contact-form");
const submitBtn = document.getElementById("form-submit-btn");
const successBox = document.querySelector(".form-success");
const formInner = document.querySelector(".form-inner");

const chips = document.querySelectorAll(".subject-chip");
const subjectInput = document.getElementById("contact-subject");

chips.forEach(chip => {
    chip.addEventListener("click", () => {
        chips.forEach(chip => {
            chip.addEventListener("click", () => {
                chip.classList.toggle("active");
                const selected = [...document.querySelectorAll(".subject-chip.active")].map(c => c.textContent.trim());
                subjectInput.value = selected.length ? selected.join(", ") : "General";
            });
        });
    });
});

form.addEventListener("submit", function (e) {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.innerHTML = "Sending...";
    emailjs.sendForm(
        SERVICE_ID,
        TEMPLATE_ID,
        form
    ).then(() => {
        form.reset();
        subjectInput.value = "General";
        chips.forEach(c => c.classList.remove("active"));
        formInner.style.display = "none";
        successBox.style.display = "flex";
    }).catch(error => {
        console.error(error);
        alert("Failed to send message. Please try again.");

    }).finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
            <span class="submit-icon">🚀</span>
            Send Message
        `;
    });
});