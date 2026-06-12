import { describe, test } from "vite-plus/test";
import { eb02MonkeyDLuffy060 } from "../../../../../cards/src/cards/EB02/leaders/060-monkey-d-luffy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-060 Monkey.D.Luffy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02MonkeyDLuffy060);
  });
});
