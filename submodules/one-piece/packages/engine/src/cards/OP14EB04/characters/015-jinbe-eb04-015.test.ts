import { describe, test } from "vite-plus/test";
import { op14eb04JinbeEb04015015 } from "../../../../../cards/src/cards/characters/eb04-015-jinbe-eb04-015.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-015 Jinbe - EB04-015", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04JinbeEb04015015);
  });
});
