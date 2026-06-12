import { describe, test } from "vite-plus/test";
import { op09NicoOlvia106 } from "../../../../../cards/src/cards/OP09/characters/106-nico-olvia.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-106 Nico Olvia", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09NicoOlvia106);
  });
});
