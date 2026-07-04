import { describe, test } from "vite-plus/test";
import { op03CharlotteChiffon109 } from "../../../../../cards/src/cards/OP03/characters/109-charlotte-chiffon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-109 Charlotte Chiffon", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03CharlotteChiffon109);
  });
});
