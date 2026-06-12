import { describe, test } from "vite-plus/test";
import { op12BeloBetty090 } from "../../../../../cards/src/cards/OP12/characters/090-belo-betty.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-090 Belo Betty", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12BeloBetty090);
  });
});
