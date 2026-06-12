import { describe, test } from "vite-plus/test";
import { prb01EdwardNewgateReprint004 } from "../../../../../cards/src/cards/PRB01/characters/004-edward-newgate-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-004 Edward.Newgate (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01EdwardNewgateReprint004);
  });
});
