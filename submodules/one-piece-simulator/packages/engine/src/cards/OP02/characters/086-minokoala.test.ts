import { describe, test } from "vite-plus/test";
import { op02Minokoala086 } from "../../../../../cards/src/cards/OP02/characters/086-minokoala.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-086 Minokoala", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Minokoala086);
  });
});
