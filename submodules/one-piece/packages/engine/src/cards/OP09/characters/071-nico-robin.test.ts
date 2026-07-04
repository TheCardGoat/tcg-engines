import { describe, test } from "vite-plus/test";
import { op09NicoRobin071 } from "../../../../../cards/src/cards/OP09/characters/071-nico-robin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-071 Nico Robin", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09NicoRobin071);
  });
});
