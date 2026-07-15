import { describe, test } from "vite-plus/test";
import { op10FightingFish069 } from "../../../../../cards/src/cards/OP10/characters/069-fighting-fish.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-069 Fighting Fish", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10FightingFish069);
  });
});
