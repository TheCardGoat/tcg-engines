import { describe, test } from "vite-plus/test";
import { prb02BuggyOp03008PirateFoil008 } from "../../../../../cards/src/cards/PRB02/characters/008-buggy-op03-008-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-008 Buggy - OP03-008 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02BuggyOp03008PirateFoil008);
  });
});
