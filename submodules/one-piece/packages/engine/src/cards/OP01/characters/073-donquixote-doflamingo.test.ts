import { describe, test } from "vite-plus/test";
import { op01DonquixoteDoflamingo073 } from "../../../../../cards/src/cards/OP01/characters/073-donquixote-doflamingo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-073 Donquixote Doflamingo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01DonquixoteDoflamingo073);
  });
});
