import { describe, test } from "vite-plus/test";
import { prb01Kaido003 } from "../../../../../cards/src/cards/PRB01/characters/003-kaido.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST04-003 Kaido", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01Kaido003);
  });
});
