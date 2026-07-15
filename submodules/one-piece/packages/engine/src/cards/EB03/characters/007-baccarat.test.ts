import { describe, test } from "vite-plus/test";
import { eb03Baccarat007 } from "../../../../../cards/src/cards/EB03/characters/007-baccarat.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-007 Baccarat", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Baccarat007);
  });
});
