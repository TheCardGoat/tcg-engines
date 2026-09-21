import { describe, test } from "vite-plus/test";
import { op04DonquixoteDoflamingo031 } from "../../../../../cards/src/cards/characters/op04-031-donquixote-doflamingo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-031 Donquixote Doflamingo", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04DonquixoteDoflamingo031);
  });
});
