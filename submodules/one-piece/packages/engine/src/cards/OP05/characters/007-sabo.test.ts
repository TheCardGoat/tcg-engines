import { describe, test } from "vite-plus/test";
import { op05Sabo007 } from "../../../../../cards/src/cards/OP05/characters/007-sabo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-007 Sabo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Sabo007);
  });
});
