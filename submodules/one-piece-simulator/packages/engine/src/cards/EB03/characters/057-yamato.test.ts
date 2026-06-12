import { describe, test } from "vite-plus/test";
import { eb03Yamato057 } from "../../../../../cards/src/cards/EB03/characters/057-yamato.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-057 Yamato", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Yamato057);
  });
});
