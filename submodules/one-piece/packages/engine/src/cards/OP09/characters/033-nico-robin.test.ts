import { describe, test } from "vite-plus/test";
import { op09NicoRobin033 } from "../../../../../cards/src/cards/characters/op09-033-nico-robin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-033 Nico Robin", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09NicoRobin033);
  });
});
