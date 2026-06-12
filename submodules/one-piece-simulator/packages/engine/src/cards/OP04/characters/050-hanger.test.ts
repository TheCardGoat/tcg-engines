import { describe, test } from "vite-plus/test";
import { op04Hanger050 } from "../../../../../cards/src/cards/OP04/characters/050-hanger.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-050 Hanger", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Hanger050);
  });
});
