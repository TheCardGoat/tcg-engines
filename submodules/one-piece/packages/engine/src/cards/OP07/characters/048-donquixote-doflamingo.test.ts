import { describe, test } from "vite-plus/test";
import { op07DonquixoteDoflamingo048 } from "../../../../../cards/src/cards/OP07/characters/048-donquixote-doflamingo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-048 Donquixote Doflamingo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07DonquixoteDoflamingo048);
  });
});
