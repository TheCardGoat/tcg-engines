import { describe, test } from "vite-plus/test";
import { op04DonquixoteDoflamingo019 } from "../../../../../cards/src/cards/leaders/op04-019-donquixote-doflamingo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-019 Donquixote Doflamingo", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04DonquixoteDoflamingo019);
  });
});
