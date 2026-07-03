import { describe, test } from "vite-plus/test";
import { op14eb04BoaHancockOp14041041 } from "../../../../../cards/src/cards/OP14EB04/leaders/041-boa-hancock-op14-041.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-041 Boa Hancock - OP14-041", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04BoaHancockOp14041041);
  });
});
