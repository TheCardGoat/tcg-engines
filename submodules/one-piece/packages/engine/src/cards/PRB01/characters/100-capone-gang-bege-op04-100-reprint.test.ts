import { describe, test } from "vite-plus/test";
import { prb01CaponeGangBegeOp04100Reprint100 } from "../../../../../cards/src/cards/PRB01/characters/100-capone-gang-bege-op04-100-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-100 100-capone-gang-bege-op04-100-reprint", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01CaponeGangBegeOp04100Reprint100);
  });
});
