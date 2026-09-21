import { describe, test } from "vite-plus/test";
import { prb02DonquixoteDoflamingo011 } from "../../../../../cards/src/cards/characters/prb02-011-donquixote-doflamingo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("PRB02-011 Donquixote Doflamingo", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02DonquixoteDoflamingo011);
  });
});
