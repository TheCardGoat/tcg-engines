import { describe, test } from "vite-plus/test";
import { op05MonkeyDLuffy060 } from "../../../../../cards/src/cards/OP05/leaders/060-monkey-d-luffy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-060 Monkey.D.Luffy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05MonkeyDLuffy060);
  });
});
