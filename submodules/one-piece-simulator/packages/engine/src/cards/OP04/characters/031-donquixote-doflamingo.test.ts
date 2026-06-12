import { describe, test } from "vite-plus/test";
import { op04DonquixoteDoflamingo031 } from "../../../../../cards/src/cards/OP04/characters/031-donquixote-doflamingo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-031 Donquixote Doflamingo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04DonquixoteDoflamingo031);
  });
});
