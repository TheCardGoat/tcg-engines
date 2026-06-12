import { describe, test } from "vite-plus/test";
import { eb03Carina004 } from "../../../../../cards/src/cards/EB03/characters/004-carina.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-004 Carina", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Carina004);
  });
});
