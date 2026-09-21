import { describe, test } from "vite-plus/test";
import { op02Magura016 } from "../../../../../cards/src/cards/characters/op02-016-magura.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-016 Magura", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Magura016);
  });
});
