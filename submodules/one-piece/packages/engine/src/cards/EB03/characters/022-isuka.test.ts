import { describe, test } from "vite-plus/test";
import { eb03Isuka022 } from "../../../../../cards/src/cards/characters/eb03-022-isuka.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-022 Isuka", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Isuka022);
  });
});
