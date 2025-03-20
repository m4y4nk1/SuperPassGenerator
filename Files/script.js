// DOM Elements
const themeToggle = document.getElementById("themeToggle");
const passwordOutput = document.getElementById("passwordOutput");
const copyBtn = document.getElementById("copyBtn");
const lengthSlider = document.getElementById("lengthSlider");
const lengthValue = document.getElementById("lengthValue");
const generateBtn = document.getElementById("generateBtn");
const notification = document.getElementById("notification");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");
const checkboxes = document.querySelectorAll(".checkbox");

// Dark Mode Toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
});

// Update length display
lengthSlider.addEventListener("input", () => {
  lengthValue.textContent = lengthSlider.value;
});

// Show/hide copy button
passwordOutput.addEventListener("input", toggleCopyButton);

function toggleCopyButton() {
  if (passwordOutput.value.length > 0) {
    copyBtn.style.display = "block";
  } else {
    copyBtn.style.display = "none";
  }
}

// Copy password
copyBtn.addEventListener("click", () => {
  passwordOutput.select();
  document.execCommand("copy");

  // Show notification
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
});

// Password Generator Class
class PasswordGenerator {
  constructor() {
    this.charset = {
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      numbers: "0123456789",
      symbols: "!@#$%^&*()-_=+[]{}|;:,.<>?/",
    };
  }

  generate() {
    let charPool = "";
    let password = "";
    let hasSelection = false;

    // Check which character sets to include
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        charPool += this.charset[checkbox.id];
        hasSelection = true;
      }
    });

    // Validate at least one option is selected
    if (!hasSelection) {
      alert("Please select at least one character type");
      return "";
    }

    // Generate password
    const length = parseInt(lengthSlider.value);

    // Ensure we have enough entropy by using a cryptographically secure RNG if available
    if (window.crypto && window.crypto.getRandomValues) {
      const values = new Uint32Array(length);
      window.crypto.getRandomValues(values);

      for (let i = 0; i < length; i++) {
        password += charPool.charAt(values[i] % charPool.length);
      }
    } else {
      // Fallback to Math.random
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charPool.length);
        password += charPool.charAt(randomIndex);
      }
    }

    return password;
  }
}

// Calculate password strength
function calculateStrength(password) {
  if (!password) {
    strengthBar.style.width = "0";
    strengthBar.className = "strength-bar";
    strengthText.textContent = "";
    return;
  }

  const length = password.length;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  // Calculate complexity score
  let score = 0;

  // Length score
  if (length >= 8) score += 1;
  if (length >= 12) score += 1;
  if (length >= 16) score += 1;

  // Character type score
  if (hasLower) score += 1;
  if (hasUpper) score += 1;
  if (hasNumber) score += 1;
  if (hasSymbol) score += 1;

  // Set strength bar
  const percentage = Math.min(100, (score / 7) * 100);
  strengthBar.style.width = `${percentage}%`;

  // Set strength class and text
  if (score < 4) {
    strengthBar.className = "strength-bar weak";
    strengthText.textContent = "Weak";
  } else if (score < 6) {
    strengthBar.className = "strength-bar medium";
    strengthText.textContent = "Medium";
  } else {
    strengthBar.className = "strength-bar strong";
    strengthText.textContent = "Strong";
  }
}

// Generate password
generateBtn.addEventListener("click", () => {
  const generator = new PasswordGenerator();
  const password = generator.generate();

  if (password) {
    passwordOutput.value = password;
    calculateStrength(password);
    toggleCopyButton();
  }
});

// Initialize UI
window.addEventListener("DOMContentLoaded", () => {
  // Generate initial password
  generateBtn.click();

  // Check for saved theme preference
  const darkModePreferred =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (darkModePreferred) {
    document.body.classList.add("dark-mode");
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
});
