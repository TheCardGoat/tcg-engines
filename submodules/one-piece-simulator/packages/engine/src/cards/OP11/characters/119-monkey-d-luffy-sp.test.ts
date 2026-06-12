import { describe, test } from "vite-plus/test";
import { op11MonkeyDLuffySp119 } from "../../../../../cards/src/cards/OP11/characters/119-monkey-d-luffy-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-119 Monkey.D.Luffy (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11MonkeyDLuffySp119);
  });
});
