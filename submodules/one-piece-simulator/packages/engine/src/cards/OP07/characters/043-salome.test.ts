import { describe, test } from "vite-plus/test";
import { op07Salome043 } from "../../../../../cards/src/cards/OP07/characters/043-salome.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-043 Salome", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Salome043);
  });
});
