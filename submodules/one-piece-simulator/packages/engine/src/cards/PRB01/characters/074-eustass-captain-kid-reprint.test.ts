import { describe, test } from "vite-plus/test";
import { prb01EustassCaptainKidReprint074 } from "../../../../../cards/src/cards/PRB01/characters/074-eustass-captain-kid-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-074 074-eustass-captain-kid-reprint", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01EustassCaptainKidReprint074);
  });
});
