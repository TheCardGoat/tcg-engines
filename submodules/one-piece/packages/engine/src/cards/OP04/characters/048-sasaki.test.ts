import { describe, test } from "vite-plus/test";
import { op04Sasaki048 } from "../../../../../cards/src/cards/OP04/characters/048-sasaki.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-048 Sasaki", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Sasaki048);
  });
});
