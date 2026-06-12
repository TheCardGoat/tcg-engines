import { describe, test } from "vite-plus/test";
import { op04Mr5Gem072 } from "../../../../../cards/src/cards/OP04/characters/072-mr-5-gem.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-072 Mr.5 (Gem)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Mr5Gem072);
  });
});
