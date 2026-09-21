import { describe, test } from "vite-plus/test";
import { op04Sasaki048 } from "../../../../../cards/src/cards/characters/op04-048-sasaki.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-048 Sasaki", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Sasaki048);
  });
});
