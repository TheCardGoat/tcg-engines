import { describe, test } from "vite-plus/test";
import { op12DonquixoteDoflamingo107 } from "../../../../../cards/src/cards/OP12/characters/107-donquixote-doflamingo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-107 Donquixote Doflamingo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12DonquixoteDoflamingo107);
  });
});
