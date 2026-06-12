import { describe, test } from "vite-plus/test";
import { op14eb04DonquixoteDoflamingoOp14060060 } from "../../../../../cards/src/cards/OP14EB04/leaders/060-donquixote-doflamingo-op14-060.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-060 Donquixote Doflamingo - OP14-060", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04DonquixoteDoflamingoOp14060060);
  });
});
