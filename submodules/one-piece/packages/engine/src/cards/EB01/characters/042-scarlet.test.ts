import { describe, test } from "vite-plus/test";
import { eb01Scarlet042 } from "../../../../../cards/src/cards/characters/eb01-042-scarlet.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-042 Scarlet", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Scarlet042);
  });
});
