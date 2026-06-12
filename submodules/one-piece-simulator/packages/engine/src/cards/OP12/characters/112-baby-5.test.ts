import { describe, test } from "vite-plus/test";
import { op12Baby5112 } from "../../../../../cards/src/cards/OP12/characters/112-baby-5.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-112 Baby 5", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Baby5112);
  });
});
