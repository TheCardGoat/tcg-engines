import { describe, test } from "vite-plus/test";
import { op14eb04Salome106 } from "../../../../../cards/src/cards/OP14EB04/characters/106-salome.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-106 Salome", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Salome106);
  });
});
