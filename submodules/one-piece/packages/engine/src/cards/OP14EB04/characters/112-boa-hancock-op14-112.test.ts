import { describe, test } from "vite-plus/test";
import { op14eb04BoaHancockOp14112112 } from "../../../../../cards/src/cards/OP14EB04/characters/112-boa-hancock-op14-112.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-112 Boa Hancock - OP14-112", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04BoaHancockOp14112112);
  });
});
