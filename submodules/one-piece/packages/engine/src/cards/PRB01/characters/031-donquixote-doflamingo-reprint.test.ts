import { describe, test } from "vite-plus/test";
import { prb01DonquixoteDoflamingoReprint031 } from "../../../../../cards/src/cards/PRB01/characters/031-donquixote-doflamingo-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-031 Donquixote Doflamingo (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01DonquixoteDoflamingoReprint031);
  });
});
