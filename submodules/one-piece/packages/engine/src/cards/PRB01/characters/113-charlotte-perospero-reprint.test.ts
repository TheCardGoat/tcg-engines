import { describe, test } from "vite-plus/test";
import { prb01CharlottePerosperoReprint113 } from "../../../../../cards/src/cards/PRB01/characters/113-charlotte-perospero-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-113 Charlotte Perospero (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01CharlottePerosperoReprint113);
  });
});
