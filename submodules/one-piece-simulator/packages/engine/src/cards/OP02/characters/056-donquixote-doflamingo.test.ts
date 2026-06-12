import { describe, test } from "vite-plus/test";
import { op02DonquixoteDoflamingo056 } from "../../../../../cards/src/cards/OP02/characters/056-donquixote-doflamingo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-056 Donquixote Doflamingo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02DonquixoteDoflamingo056);
  });
});
