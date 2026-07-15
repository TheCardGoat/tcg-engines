import { describe, test } from "vite-plus/test";
import { eb01Kalifa031 } from "../../../../../cards/src/cards/EB01/characters/031-kalifa.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-031 Kalifa", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Kalifa031);
  });
});
