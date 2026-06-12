import { describe, test } from "vite-plus/test";
import { op10EustassCaptainKid112 } from "../../../../../cards/src/cards/OP10/characters/112-eustass-captain-kid.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-112 112-eustass-captain-kid", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10EustassCaptainKid112);
  });
});
