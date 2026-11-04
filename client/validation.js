function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidEmailOrPhone(value) {
  if (isValidEmail(value)) return true;

  const normalized = value.replace(/[\s()-]/g, "");
  return /^(?:\+62|62|0)8\d{7,12}$/.test(normalized);
}

function isValidName(value) {
  return value.trim().length >= 2;
}

function isValidPassword(value) {
  return value.length >= 8;
}

function passwordsMatch(password, confirmation) {
  return password === confirmation;
}

function isTermsAccepted(accepted) {
  return accepted === true;
}

module.exports = {
    isValidEmail,
    isValidEmailOrPhone,
    isValidName,
    isValidPassword,
    passwordsMatch,
    isTermsAccepted,
  };

if (typeof window !== "undefined") {
  window.MoodboxValidation = {
    isValidEmail,
    isValidEmailOrPhone,
    isValidName,
    isValidPassword,
    passwordsMatch,
    isTermsAccepted,
  };
}
