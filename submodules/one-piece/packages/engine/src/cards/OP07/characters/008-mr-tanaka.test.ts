import { describe, test } from "vite-plus/test";
import { op07MrTanaka008 } from "../../../../../cards/src/cards/OP07/characters/008-mr-tanaka.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-008 Mr. Tanaka", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07MrTanaka008);
  });
});
