import { describe, test } from "vite-plus/test";
import { op10DonquixoteDoflamingo071 } from "../../../../../cards/src/cards/OP10/characters/071-donquixote-doflamingo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-071 Donquixote Doflamingo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10DonquixoteDoflamingo071);
  });
});
