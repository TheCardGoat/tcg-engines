import { describe, test } from "vite-plus/test";
import { eb03Wanda019 } from "../../../../../cards/src/cards/EB03/characters/019-wanda.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-019 Wanda", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Wanda019);
  });
});
