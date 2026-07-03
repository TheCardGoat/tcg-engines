import { describe, test } from "vite-plus/test";
import { prb02EustassCaptainKidReprint112 } from "../../../../../cards/src/cards/PRB02/characters/112-eustass-captain-kid-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-112 112-eustass-captain-kid-reprint", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02EustassCaptainKidReprint112);
  });
});
