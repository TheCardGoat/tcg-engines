import { describe, test } from "vite-plus/test";
import { eb01PrinceBellett026 } from "../../../../../cards/src/cards/EB01/characters/026-prince-bellett.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-026 Prince Bellett", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01PrinceBellett026);
  });
});
