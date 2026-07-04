import { describe, test } from "vite-plus/test";
import { eb03Koala042 } from "../../../../../cards/src/cards/EB03/characters/042-koala.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-042 Koala", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Koala042);
  });
});
