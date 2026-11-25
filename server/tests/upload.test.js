const express = require("express");
const request = require("supertest");
const { upload } = require("../src/middlewares/upload");
const { errorHandler } = require("../src/middlewares/errorHandler");

const app = express();
app.post("/up", upload.single("image"), (req, res) => res.json({ ok: true, size: req.file.size }));
app.use(errorHandler);

describe("upload middleware", () => {
  it("menerima PNG kecil", async () => {
    const res = await request(app)
      .post("/up")
      .attach("image", Buffer.alloc(1024), { filename: "a.png", contentType: "image/png" });
    expect(res.status).toBe(200);
  });

  it("menolak PDF dengan status 415", async () => {
    const res = await request(app)
      .post("/up")
      .attach("image", Buffer.alloc(100), { filename: "a.pdf", contentType: "application/pdf" });
    expect(res.status).toBe(415);
  });

  it("menolak file lebih dari 2 MB dengan status 413", async () => {
    const res = await request(app)
      .post("/up")
      .attach("image", Buffer.alloc(2 * 1024 * 1024 + 1), { filename: "big.jpg", contentType: "image/jpeg" });
    expect(res.status).toBe(413);
  });
});