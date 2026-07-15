import { describe, test } from "vite-plus/test";
import { op07DonquixoteDoflamingoSp073 } from "../../../../../cards/src/cards/OP07/characters/073-donquixote-doflamingo-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-073 Donquixote Doflamingo (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07DonquixoteDoflamingoSp073);
  });
});
