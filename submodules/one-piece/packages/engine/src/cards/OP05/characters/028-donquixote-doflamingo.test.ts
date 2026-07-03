import { describe, test } from "vite-plus/test";
import { op05DonquixoteDoflamingo028 } from "../../../../../cards/src/cards/OP05/characters/028-donquixote-doflamingo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-028 Donquixote Doflamingo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05DonquixoteDoflamingo028);
  });
});
