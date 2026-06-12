import { describe, test } from "vite-plus/test";
import { op12Jinbe009 } from "../../../../../cards/src/cards/OP12/characters/009-jinbe.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-009 Jinbe", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Jinbe009);
  });
});
