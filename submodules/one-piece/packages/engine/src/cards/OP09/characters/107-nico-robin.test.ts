import { describe, test } from "vite-plus/test";
import { op09NicoRobin107 } from "../../../../../cards/src/cards/OP09/characters/107-nico-robin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-107 Nico Robin", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09NicoRobin107);
  });
});
