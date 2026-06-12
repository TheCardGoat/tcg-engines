import { describe, test } from "vite-plus/test";
import { op11NicoRobin009 } from "../../../../../cards/src/cards/OP11/characters/009-nico-robin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-009 Nico Robin", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11NicoRobin009);
  });
});
