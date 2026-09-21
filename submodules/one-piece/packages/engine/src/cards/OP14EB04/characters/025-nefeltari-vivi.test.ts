import { describe, test } from "vite-plus/test";
import { op14eb04NefeltariVivi025 } from "../../../../../cards/src/cards/characters/eb04-025-nefeltari-vivi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-025 Nefeltari Vivi", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04NefeltariVivi025);
  });
});
