import { describe, test } from "vite-plus/test";
import { op12YasoppSp013 } from "../../../../../cards/src/cards/OP12/characters/013-yasopp-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-013 Yasopp (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12YasoppSp013);
  });
});
