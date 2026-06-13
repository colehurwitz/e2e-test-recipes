import { describe, it, expect, beforeEach, vi } from "vitest";

const localStore = {};
const localStorageMock = {
  getItem: vi.fn((key) => localStore[key] ?? null),
  setItem: vi.fn((key, value) => {
    localStore[key] = value;
  }),
  removeItem: vi.fn((key) => {
    delete localStore[key];
  }),
  clear: vi.fn(() => {
    Object.keys(localStore).forEach((k) => delete localStore[k]);
  }),
};

vi.stubGlobal("localStorage", localStorageMock);
vi.stubGlobal("document", {
  addEventListener: vi.fn(),
  getElementById: vi.fn(() => ({ addEventListener: vi.fn(), innerHTML: "" })),
  querySelectorAll: vi.fn(() => []),
  createElement: vi.fn(() => ({
    className: "",
    dataset: {},
    innerHTML: "",
    addEventListener: vi.fn(),
  })),
  documentElement: {
    getAttribute: vi.fn(() => "light"),
    setAttribute: vi.fn(),
  },
  title: "Recipe Viewer",
  body: { style: {} },
});
vi.stubGlobal("window", {
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  print: vi.fn(),
  matchMedia: vi.fn(() => ({ matches: false })),
});
vi.stubGlobal("requestAnimationFrame", vi.fn((cb) => cb()));

const appModule = await import("../app.js");

function clearStore() {
  Object.keys(localStore).forEach((k) => delete localStore[k]);
}

describe("loadRatings", () => {
  beforeEach(clearStore);

  it("returns empty object when no ratings stored", () => {
    expect(appModule.loadRatings()).toEqual({});
  });

  it("returns parsed ratings from localStorage", () => {
    localStore["recipe-ratings"] = JSON.stringify({ 1: { ratings: [5], average: 5 } });
    expect(appModule.loadRatings()).toEqual({ 1: { ratings: [5], average: 5 } });
  });

  it("returns empty object on invalid JSON", () => {
    localStore["recipe-ratings"] = "not-json";
    expect(appModule.loadRatings()).toEqual({});
  });
});

describe("saveRatings", () => {
  beforeEach(clearStore);

  it("persists ratings to localStorage", () => {
    const data = { 1: { ratings: [4], average: 4 } };
    appModule.saveRatings(data);
    expect(localStore["recipe-ratings"]).toBe(JSON.stringify(data));
  });
});

describe("addRating", () => {
  beforeEach(clearStore);

  it("creates new rating entry for a recipe", () => {
    const result = appModule.addRating(1, 4);
    expect(result.ratings).toEqual([4]);
    expect(result.average).toBe(4);
  });

  it("appends to existing ratings and recalculates average", () => {
    appModule.addRating(1, 4);
    const result = appModule.addRating(1, 2);
    expect(result.ratings).toEqual([4, 2]);
    expect(result.average).toBe(3);
  });

  it("marks recipe as rated", () => {
    appModule.addRating(1, 5);
    expect(appModule.hasRated(1)).toBe(true);
  });
});

describe("getRatingData", () => {
  beforeEach(clearStore);

  it("returns default for unrated recipe", () => {
    expect(appModule.getRatingData(99)).toEqual({ ratings: [], average: 0 });
  });

  it("returns stored rating data", () => {
    appModule.addRating(2, 3);
    const data = appModule.getRatingData(2);
    expect(data.ratings).toEqual([3]);
    expect(data.average).toBe(3);
  });
});

describe("hasRated", () => {
  beforeEach(clearStore);

  it("returns false for unrated recipe", () => {
    expect(appModule.hasRated(1)).toBe(false);
  });

  it("returns true after rating", () => {
    appModule.addRating(1, 5);
    expect(appModule.hasRated(1)).toBe(true);
  });
});

describe("getFilteredRecipes", () => {
  beforeEach(() => {
    appModule.setActiveCategory("All");
    appModule.setSearchQuery("");
  });

  it("returns all recipes with default filters", () => {
    const result = appModule.getFilteredRecipes();
    expect(result.length).toBe(6);
  });

  it("filters by category", () => {
    appModule.setActiveCategory("Breakfast");
    const result = appModule.getFilteredRecipes();
    expect(result.every((r) => r.category === "Breakfast")).toBe(true);
    expect(result.length).toBe(2);
  });

  it("filters by search query in title", () => {
    appModule.setSearchQuery("pancake");
    const result = appModule.getFilteredRecipes();
    expect(result.length).toBe(1);
    expect(result[0].title).toBe("Classic Pancakes");
  });

  it("filters by search query in ingredients", () => {
    appModule.setSearchQuery("coconut");
    const result = appModule.getFilteredRecipes();
    expect(result.length).toBe(1);
    expect(result[0].title).toBe("Thai Green Curry");
  });

  it("returns empty array when nothing matches", () => {
    appModule.setSearchQuery("xyznonexistent");
    const result = appModule.getFilteredRecipes();
    expect(result.length).toBe(0);
  });
});
