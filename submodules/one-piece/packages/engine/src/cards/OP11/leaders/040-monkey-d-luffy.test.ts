import { describe, test } from "vite-plus/test";
import { op11MonkeyDLuffy040 } from "../../../../../cards/src/cards/OP11/leaders/040-monkey-d-luffy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-040 Monkey.D.Luffy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11MonkeyDLuffy040);
  });
});
