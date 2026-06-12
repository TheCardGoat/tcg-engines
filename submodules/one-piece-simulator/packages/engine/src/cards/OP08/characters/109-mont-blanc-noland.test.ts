import { describe, test } from "vite-plus/test";
import { op08MontBlancNoland109 } from "../../../../../cards/src/cards/OP08/characters/109-mont-blanc-noland.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-109 Mont Blanc Noland", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08MontBlancNoland109);
  });
});
