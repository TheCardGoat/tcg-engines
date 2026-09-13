import { describe, test } from "vite-plus/test";
import { eb03Kuina014 } from "../../../../../cards/src/cards/EB03/characters/014-kuina.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-014 Kuina", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Kuina014);
  });
});
