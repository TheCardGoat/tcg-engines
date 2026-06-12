import { describe, test } from "vite-plus/test";
import { op14eb04Mr5Gem094 } from "../../../../../cards/src/cards/OP14EB04/characters/094-mr-5-gem.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-094 Mr.5(Gem)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Mr5Gem094);
  });
});
