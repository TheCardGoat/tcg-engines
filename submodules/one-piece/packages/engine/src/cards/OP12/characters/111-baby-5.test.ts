import { describe, test } from "vite-plus/test";
import { op12Baby5111 } from "../../../../../cards/src/cards/OP12/characters/111-baby-5.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-111 Baby 5", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Baby5111);
  });
});
