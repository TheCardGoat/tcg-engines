import { describe, test } from "vite-plus/test";
import { op13Gyogyo103 } from "../../../../../cards/src/cards/OP13/characters/103-gyogyo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-103 Gyogyo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Gyogyo103);
  });
});
