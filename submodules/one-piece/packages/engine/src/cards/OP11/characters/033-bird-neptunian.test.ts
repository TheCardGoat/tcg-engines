import { describe, test } from "vite-plus/test";
import { op11BirdNeptunian033 } from "../../../../../cards/src/cards/OP11/characters/033-bird-neptunian.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-033 Bird Neptunian", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11BirdNeptunian033);
  });
});
