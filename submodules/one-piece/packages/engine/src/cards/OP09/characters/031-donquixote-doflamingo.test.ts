import { describe, test } from "vite-plus/test";
import { op09DonquixoteDoflamingo031 } from "../../../../../cards/src/cards/OP09/characters/031-donquixote-doflamingo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-031 Donquixote Doflamingo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09DonquixoteDoflamingo031);
  });
});
