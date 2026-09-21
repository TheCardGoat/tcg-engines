import { describe, test } from "vite-plus/test";
import { eb01Gastino053 } from "../../../../../cards/src/cards/characters/eb01-053-gastino.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-053 Gastino", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Gastino053);
  });
});
