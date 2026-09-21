import { describe, test } from "vite-plus/test";
import { op04Mr5Gem072 } from "../../../../../cards/src/cards/characters/op04-072-mr-5-gem.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-072 Mr.5 (Gem)", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Mr5Gem072);
  });
});
