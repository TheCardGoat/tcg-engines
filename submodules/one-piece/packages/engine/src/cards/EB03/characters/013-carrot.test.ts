import { describe, test } from "vite-plus/test";
import { eb03Carrot013 } from "../../../../../cards/src/cards/EB03/characters/013-carrot.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-013 Carrot", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Carrot013);
  });
});
