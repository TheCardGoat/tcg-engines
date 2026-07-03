import { describe, test } from "vite-plus/test";
import { eb03Viola030 } from "../../../../../cards/src/cards/EB03/characters/030-viola.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-030 Viola", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Viola030);
  });
});
