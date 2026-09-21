import { describe, test } from "vite-plus/test";
import { op14eb04BirdNeptunian016 } from "../../../../../cards/src/cards/characters/eb04-016-bird-neptunian.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-016 Bird Neptunian", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04BirdNeptunian016);
  });
});
