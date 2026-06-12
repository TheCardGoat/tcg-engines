import { describe, test } from "vite-plus/test";
import { op14eb04DonquixoteDoflamingoOp14069069 } from "../../../../../cards/src/cards/OP14EB04/characters/069-donquixote-doflamingo-op14-069.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-069 Donquixote Doflamingo - OP14-069", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04DonquixoteDoflamingoOp14069069);
  });
});
