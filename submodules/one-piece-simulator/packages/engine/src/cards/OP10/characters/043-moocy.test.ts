import { describe, test } from "vite-plus/test";
import { op10Moocy043 } from "../../../../../cards/src/cards/OP10/characters/043-moocy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-043 Moocy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Moocy043);
  });
});
