import { describe, test } from "vite-plus/test";
import { op01Holedem113 } from "../../../../../cards/src/cards/characters/op01-113-holedem.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-113 Holedem", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Holedem113);
  });
});
