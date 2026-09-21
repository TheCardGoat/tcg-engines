import { describe, test } from "vite-plus/test";
import { op14eb04DonquixoteDoflamingoOp14060060 } from "../../../../../cards/src/cards/leaders/op14-060-donquixote-doflamingo-op14-060.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-060 Donquixote Doflamingo - OP14-060", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04DonquixoteDoflamingoOp14060060);
  });
});
