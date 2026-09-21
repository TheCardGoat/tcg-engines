import { describe, test } from "vite-plus/test";
import { op05MonkeyDLuffy060 } from "../../../../../cards/src/cards/leaders/op05-060-monkey-d-luffy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-060 Monkey.D.Luffy", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05MonkeyDLuffy060);
  });
});
