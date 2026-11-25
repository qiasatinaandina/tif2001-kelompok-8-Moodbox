const { buildPackageFilter, validatePackageInput } = require("../src/utils/packageQuery");
const { parsePagination, buildMeta } = require("../src/utils/pagination");

describe("buildPackageFilter", () => {
  it("tanpa filter menghasilkan clause kosong", () => {
    expect(buildPackageFilter({})).toEqual({ clause: "", params: [] });
  });

  it("search memakai ILIKE dengan wildcard", () => {
    const r = buildPackageFilter({ search: "duo" });
    expect(r.clause).toContain("ILIKE $1");
    expect(r.params).toEqual(["%duo%"]);
  });

  it("search + category memberi placeholder berurutan", () => {
    const r = buildPackageFilter({ search: "duo", category: "2" });
    expect(r.clause).toContain("p.category_id = $2");
    expect(r.params).toEqual(["%duo%", 2]);
  });

  it("category non-angka diabaikan", () => {
    expect(buildPackageFilter({ category: "abc" }).clause).toBe("");
  });

  it("search berisi spasi saja diabaikan", () => {
    expect(buildPackageFilter({ search: "   " }).clause).toBe("");
  });
});

describe("pagination", () => {
  it("offset = (page - 1) * limit", () => {
    expect(parsePagination({ page: "3", limit: "10" })).toEqual({ page: 3, limit: 10, offset: 20 });
  });

  it("memakai nilai default", () => {
    expect(parsePagination({})).toEqual({ page: 1, limit: 10, offset: 0 });
  });

  it("limit dibatasi maksimal 50 dan page minimal 1", () => {
    expect(parsePagination({ limit: "999" }).limit).toBe(50);
    expect(parsePagination({ page: "-5" }).page).toBe(1);
  });

  it("meta sesuai format handout", () => {
    expect(buildMeta(23, 2, 10)).toEqual({ totalRows: 23, totalPages: 3, currentPage: 2, limit: 10 });
  });
});

describe("validatePackageInput", () => {
  it("menolak data wajib kosong", () => {
    expect(validatePackageInput({}).errors.length).toBeGreaterThan(0);
  });

  it("menerima data valid dan mengubah angka", () => {
    const r = validatePackageInput({ name: "Solo", price: "95000", duration_min: "20", max_pax: "1" });
    expect(r.errors).toEqual([]);
    expect(r.values.price).toBe(95000);
  });

  it("menolak harga negatif", () => {
    const r = validatePackageInput({ name: "Solo", price: "-1", duration_min: "20", max_pax: "1" });
    expect(r.errors.join()).toContain("price");
  });

  it("mode partial tidak mewajibkan semua field", () => {
    const r = validatePackageInput({ price: "160000" }, { partial: true });
    expect(r.errors).toEqual([]);
  });
});