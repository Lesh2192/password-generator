// Fonction pour ajouter une animation de fade
function fadeIn(element, duration = 500) {
  element.style.opacity = 0;
  element.style.display = "block";
  element.style.transition = `opacity ${duration}ms ease`;
  setTimeout(() => (element.style.opacity = 1), 10);
}

// Fonction pour créer une animation de shake
function shakeElement(element) {
  element.style.animation = "shake 0.5s ease-in-out";
  element.addEventListener("animationend", () => {
    element.style.animation = "";
  });
}

// Fonction pour sauvegarder l'historique
function saveHistory() {
  const historyList = document.getElementById("history");
  const passwords = Array.from(historyList.children).map((item) =>
    item.textContent.replace("Supprimer", "").trim()
  );
  localStorage.setItem("passwordHistory", JSON.stringify(passwords));
}

// Fonction pour charger l'historique
function loadHistory() {
  const savedPasswords =
    JSON.parse(localStorage.getItem("passwordHistory")) || [];
  const historyList = document.getElementById("history");
  historyList.innerHTML = ""; // Clear existing history
  savedPasswords.forEach((password) => {
    const listItem = document.createElement("li");
    listItem.textContent = password;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Supprimer";
    deleteButton.className = "delete-btn";
    deleteButton.onclick = function () {
      listItem.style.opacity = "0";
      listItem.style.transform = "translateX(100%)";
      setTimeout(() => {
        historyList.removeChild(listItem);
        saveHistory();
      }, 300);
    };

    listItem.appendChild(deleteButton);
    historyList.appendChild(listItem);
  });
}

// Fonction pour évaluer la force du mot de passe
function evaluatePasswordStrength(password) {
  let score = 0;
  const checks = {
    length: 0,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSymbols: /[!@#$%^&*()_+\[\]{}|;:,.<>?]/.test(password),
    hasSpecialChars: /[^A-Za-z0-9]/.test(password),
    hasRepeatingChars: /(.)\\1{2,}/.test(password),
    hasConsecutiveNumbers: /(012|123|234|345|456|567|678|789)/.test(password),
    hasCommonWords: /(password|123456|qwerty|admin)/i.test(password),
  };

  if (password.length >= 12) score += 30;
  else if (password.length >= 8) score += 20;
  else if (password.length >= 6) score += 10;

  if (checks.hasUpperCase) score += 10;
  if (checks.hasLowerCase) score += 10;
  if (checks.hasNumbers) score += 10;
  if (checks.hasSymbols) score += 15;
  if (checks.hasSpecialChars) score += 15;

  if (checks.hasRepeatingChars) score -= 10;
  if (checks.hasConsecutiveNumbers) score -= 10;
  if (checks.hasCommonWords) score -= 20;

  return {
    score: Math.max(0, Math.min(100, score)),
    checks,
  };
}

function displayPasswordStrength(password) {
  const strengthIndicator = document.getElementById("password-strength");
  const result = evaluatePasswordStrength(password);
  let message = "";
  let color = "";

  if (result.score >= 80) {
    message = "Force du mot de passe : Excellente";
    color = "#2ecc71";
  } else if (result.score >= 60) {
    message = "Force du mot de passe : Forte";
    color = "#27ae60";
  } else if (result.score >= 40) {
    message = "Force du mot de passe : Moyenne";
    color = "#f1c40f";
  } else if (result.score >= 20) {
    message = "Force du mot de passe : Faible";
    color = "#e67e22";
  } else {
    message = "Force du mot de passe : Très faible";
    color = "#e74c3c";
  }

  strengthIndicator.style.transition = "color 0.3s ease";
  strengthIndicator.textContent = `${message} (${result.score}/100)`;
  strengthIndicator.style.color = color;
}

// Fonction pour ajouter à l'historique
function addToHistory(password) {
  const historyList = document.getElementById("history");
  const listItem = document.createElement("li");
  listItem.textContent = password;
  listItem.style.opacity = "0";
  listItem.style.transform = "translateY(20px)";

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Supprimer";
  deleteButton.className = "delete-btn";
  deleteButton.onclick = function () {
    listItem.style.opacity = "0";
    listItem.style.transform = "translateX(100%)";
    setTimeout(() => {
      historyList.removeChild(listItem);
      saveHistory();
    }, 300);
  };

  listItem.appendChild(deleteButton);
  historyList.insertBefore(listItem, historyList.firstChild);

  setTimeout(() => {
    listItem.style.transition = "all 0.3s ease";
    listItem.style.opacity = "1";
    listItem.style.transform = "translateY(0)";
  }, 10);

  saveHistory();
}

// Event Listener pour le bouton générer
document.getElementById("generate").addEventListener("click", function () {
  const length = parseInt(document.getElementById("length").value);
  const includeUppercase = document.getElementById("uppercase").checked;
  const includeLowercase = document.getElementById("lowercase").checked;
  const includeNumbers = document.getElementById("numbers").checked;
  const includeSymbols = document.getElementById("symbols").checked;

  const countUppercase = parseInt(
    document.getElementById("count-uppercase").value
  );
  const countLowercase = parseInt(
    document.getElementById("count-lowercase").value
  );
  const countNumbers = parseInt(document.getElementById("count-numbers").value);
  const countSymbols = parseInt(document.getElementById("count-symbols").value);

  this.style.transform = "scale(0.95)";
  setTimeout(() => (this.style.transform = "scale(1)"), 100);

  const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";

  let characterSet = "";
  let password = "";

  const totalRequired =
    countUppercase + countLowercase + countNumbers + countSymbols;
  if (totalRequired > length) {
    shakeElement(document.querySelector(".container"));
    return;
  }

  const passwordElement = document.getElementById("password");
  passwordElement.style.opacity = "0";

  if (includeUppercase) {
    for (let i = 0; i < countUppercase; i++) {
      password +=
        uppercaseLetters[Math.floor(Math.random() * uppercaseLetters.length)];
    }
    characterSet += uppercaseLetters;
  }

  if (includeLowercase) {
    for (let i = 0; i < countLowercase; i++) {
      password +=
        lowercaseLetters[Math.floor(Math.random() * lowercaseLetters.length)];
    }
    characterSet += lowercaseLetters;
  }

  if (includeNumbers) {
    for (let i = 0; i < countNumbers; i++) {
      password += numbers[Math.floor(Math.random() * numbers.length)];
    }
    characterSet += numbers;
  }

  if (includeSymbols) {
    for (let i = 0; i < countSymbols; i++) {
      password += symbols[Math.floor(Math.random() * symbols.length)];
    }
    characterSet += symbols;
  }

  while (password.length < length) {
    const randomIndex = Math.floor(Math.random() * characterSet.length);
    password += characterSet[randomIndex];
  }

  password = password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  passwordElement.textContent = password;
  fadeIn(passwordElement);

  displayPasswordStrength(password);
  addToHistory(password);
});

// Event Listener pour le bouton copier
document.getElementById("copy").addEventListener("click", function () {
  const password = document.getElementById("password").textContent;
  if (password) {
    navigator.clipboard
      .writeText(password)
      .then(() => {
        this.textContent = "Copié !";
        this.style.backgroundColor = "var(--primary)";
        this.style.color = "white";

        setTimeout(() => {
          this.textContent = "Copier";
          this.style.backgroundColor = "";
          this.style.color = "";
        }, 1500);
      })
      .catch((err) => {
        console.error("Erreur lors de la copie : ", err);
        shakeElement(this);
      });
  } else {
    shakeElement(this);
  }
});

// Event Listener pour le bouton télécharger
document.getElementById("download").addEventListener("click", function () {
  const historyList = document.getElementById("history");
  if (historyList.children.length === 0) {
    shakeElement(this);
    return;
  }

  const passwords = Array.from(historyList.children)
    .map((item) => item.textContent.replace("Supprimer", "").trim())
    .join("\n");

  const blob = new Blob([passwords], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = `passwords_${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Animation de confirmation
  this.textContent = "Téléchargé !";
  this.style.backgroundColor = "var(--primary)";
  this.style.color = "white";

  setTimeout(() => {
    this.textContent = "Télécharger";
    this.style.backgroundColor = "";
    this.style.color = "";
  }, 1500);
});

// Event Listener pour le thème
document.getElementById("toggle-theme").addEventListener("click", function () {
  document.body.style.transition =
    "background-color 0.3s ease, color 0.3s ease";
  document.body.setAttribute(
    "data-theme",
    document.body.getAttribute("data-theme") === "dark" ? "light" : "dark"
  );
});

// Styles pour les animations
const style = document.createElement("style");
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }

  .delete-btn {
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  #history li:hover .delete-btn {
    opacity: 1;
  }

  button {
    transition: transform 0.1s ease, background-color 0.3s ease, color 0.3s ease;
  }

  button:active {
    transform: scale(0.95);
  }
`;
document.head.appendChild(style);

// Initialisation
loadHistory();
