import { describe, test } from "vite-plus/test";
import { op04Ideo077 } from "../../../../../cards/src/cards/characters/op04-077-ideo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-077 Ideo", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Ideo077);
  });
});
