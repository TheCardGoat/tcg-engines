import { describe, test } from "vite-plus/test";
import { op11MonkeyDGarp095 } from "../../../../../cards/src/cards/OP11/characters/095-monkey-d-garp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-095 Monkey.D.Garp", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11MonkeyDGarp095);
  });
});
