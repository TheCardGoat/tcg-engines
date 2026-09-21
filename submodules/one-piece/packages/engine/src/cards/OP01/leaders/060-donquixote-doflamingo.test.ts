import { describe, test } from "vite-plus/test";
import { op01DonquixoteDoflamingo060 } from "../../../../../cards/src/cards/leaders/op01-060-donquixote-doflamingo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-060 Donquixote Doflamingo", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01DonquixoteDoflamingo060);
  });
});
