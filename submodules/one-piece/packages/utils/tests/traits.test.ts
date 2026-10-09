import { expect, test } from "vite-plus/test";
import { matchesTrait, normalizeTraits } from "../src/traits.ts";

test("the official ST11 Music token normalizes to its English trait", () => {
  expect(normalizeTraits(["音楽/FILM"], "ST11-005")).toEqual(["Music", "FILM"]);
  expect(normalizeTraits(["音楽", "Music", "FILM"])).toEqual(["Music", "FILM"]);
  expect(matchesTrait(["音楽/FILM"], "Music")).toBe(true);
  expect(matchesTrait(["音楽隊"], "Music")).toBe(false);
  expect(normalizeTraits(["音楽隊"])).toEqual(["音楽隊"]);
});

test("verified compound types preserve exact membership and distinct longer types", () => {
  expect(normalizeTraits(["Animal Alabasta"])).toEqual(["Animal", "Alabasta"]);
  expect(matchesTrait(["Animal Alabasta"], "Animal")).toBe(true);
  expect(matchesTrait(["Animal Kingdom Pirates"], "Animal")).toBe(false);
  expect(matchesTrait(["Former Whitebeard Pirates"], "Whitebeard Pirates")).toBe(false);
  expect(matchesTrait(["Former Whitebeard Pirates"], "Whitebeard Pirates", "includes")).toBe(true);
  expect(matchesTrait(["CP9"], "CP", "includes")).toBe(true);
  expect(matchesTrait(["CP9"], "CP")).toBe(false);
  expect(normalizeTraits(["Unknown Long Type"])).toEqual(["Unknown Long Type"]);
});

test("card-specific official corrections do not rewrite the same type on unrelated cards", () => {
  expect(normalizeTraits(["Big Mom Pirates"], "EB03-034")).toEqual(["Rocks Pirates"]);
  expect(normalizeTraits(["Big Mom Pirates"])).toEqual(["Big Mom Pirates"]);
  expect(normalizeTraits(["Straw Hat Crew"], "OP02-040")).toEqual(["FILM", "Straw Hat Crew"]);
  expect(normalizeTraits(["Straw Hat Crew"])).toEqual(["Straw Hat Crew"]);
  expect(normalizeTraits(["Big Mom Pirates"], "EB03-034_p1")).toEqual(["Rocks Pirates"]);
  expect(normalizeTraits(["Big Mom Pirates"], "EB03-034_unknown")).toEqual(["Big Mom Pirates"]);
});
