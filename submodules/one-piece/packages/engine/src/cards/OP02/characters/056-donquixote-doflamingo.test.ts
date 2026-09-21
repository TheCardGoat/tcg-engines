import { describe, test } from "vite-plus/test";
import { op02DonquixoteDoflamingo056 } from "../../../../../cards/src/cards/characters/op02-056-donquixote-doflamingo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-056 Donquixote Doflamingo", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02DonquixoteDoflamingo056);
  });
});
