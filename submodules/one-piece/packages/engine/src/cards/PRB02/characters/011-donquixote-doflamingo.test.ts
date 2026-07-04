import { describe, test } from "vite-plus/test";
import { prb02DonquixoteDoflamingo011 } from "../../../../../cards/src/cards/PRB02/characters/011-donquixote-doflamingo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("PRB02-011 Donquixote Doflamingo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02DonquixoteDoflamingo011);
  });
});
