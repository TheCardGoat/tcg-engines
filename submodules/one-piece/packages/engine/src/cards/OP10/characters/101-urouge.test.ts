import { describe, test } from "vite-plus/test";
import { op10Urouge101 } from "../../../../../cards/src/cards/characters/op10-101-urouge.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-101 Urouge", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Urouge101);
  });
});
