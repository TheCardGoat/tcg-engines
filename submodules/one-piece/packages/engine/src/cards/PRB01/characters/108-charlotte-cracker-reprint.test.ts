import { describe, test } from "vite-plus/test";
import { prb01CharlotteCrackerReprint108 } from "../../../../../cards/src/cards/PRB01/characters/108-charlotte-cracker-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-108 Charlotte Cracker (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01CharlotteCrackerReprint108);
  });
});
