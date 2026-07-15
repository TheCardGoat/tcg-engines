import { describe, test } from "vite-plus/test";
import { op05MonkeyDGarp054 } from "../../../../../cards/src/cards/OP05/characters/054-monkey-d-garp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-054 Monkey.D.Garp", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05MonkeyDGarp054);
  });
});
