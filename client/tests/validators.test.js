const {
  isValidEmail,
  isValidEmailOrPhone,
  isValidName,
  isValidPassword,
  passwordsMatch,
  isTermsAccepted,
} = require("../validators");

describe("Pengujian Validasi Form Moodbox", () => {
  test("Email dengan format benar harus valid", () => {
    expect(isValidEmail("riszan@gmail.com")).toBe(true);
  });

  test("Email dengan format salah harus tidak valid", () => {
    expect(isValidEmail("riszan.com")).toBe(false);
  });

  test("Email kosong harus tidak valid", () => {
    expect(isValidEmail("")).toBe(false);
  });

  test("Nomor HP Indonesia harus valid", () => {
    expect(isValidEmailOrPhone("081234567890")).toBe(true);
  });

  test("Nama minimal dua karakter harus valid", () => {
    expect(isValidName("Zakia")).toBe(true);
  });

  test("Nama satu karakter harus tidak valid", () => {
    expect(isValidName("A")).toBe(false);
  });

  test("Password minimal delapan karakter harus valid", () => {
    expect(isValidPassword("moodbox123")).toBe(true);
  });

  test("Password tepat delapan karakter harus valid", () => {
    expect(isValidPassword("12345678")).toBe(true);
  });

  test("Password kurang dari delapan karakter harus tidak valid", () => {
    expect(isValidPassword("12345")).toBe(false);
  });

  test("Konfirmasi password yang sama harus valid", () => {
    expect(passwordsMatch("moodbox123", "moodbox123")).toBe(true);
  });

  test("Konfirmasi password berbeda harus tidak valid", () => {
    expect(passwordsMatch("moodbox123", "moodbox456")).toBe(false);
  });

  test("Persetujuan syarat harus diterima", () => {
    expect(isTermsAccepted(true)).toBe(true);
  });

  test("Form tanpa persetujuan syarat harus tidak valid", () => {
    expect(isTermsAccepted(false)).toBe(false);
  });
});
