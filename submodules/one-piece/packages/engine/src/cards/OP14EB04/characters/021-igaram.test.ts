import { describe, test } from "vite-plus/test";
import { op14eb04Igaram021 } from "../../../../../cards/src/cards/characters/eb04-021-igaram.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-021 Igaram", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Igaram021);
  });
});
