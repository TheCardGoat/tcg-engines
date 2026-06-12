import { describe, test } from "vite-plus/test";
import { op05DonquixoteDoflamingo029 } from "../../../../../cards/src/cards/OP05/characters/029-donquixote-doflamingo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-029 Donquixote Doflamingo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05DonquixoteDoflamingo029);
  });
});
