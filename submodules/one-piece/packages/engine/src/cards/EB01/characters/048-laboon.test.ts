import { describe, test } from "vite-plus/test";
import { eb01Laboon048 } from "../../../../../cards/src/cards/EB01/characters/048-laboon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-048 Laboon", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Laboon048);
  });
});
