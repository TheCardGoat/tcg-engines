import { describe, test } from "vite-plus/test";
import { op12LimSp037 } from "../../../../../cards/src/cards/OP12/characters/037-lim-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-037 Lim (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12LimSp037);
  });
});
