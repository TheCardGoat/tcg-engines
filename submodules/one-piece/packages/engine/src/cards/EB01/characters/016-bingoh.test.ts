import { describe, test } from "vite-plus/test";
import { eb01Bingoh016 } from "../../../../../cards/src/cards/EB01/characters/016-bingoh.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-016 Bingoh", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Bingoh016);
  });
});
