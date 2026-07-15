import { describe, test } from "vite-plus/test";
import { prb01EustassCaptainKid051 } from "../../../../../cards/src/cards/PRB01/characters/051-eustass-captain-kid.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-051 051-eustass-captain-kid", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01EustassCaptainKid051);
  });
});
