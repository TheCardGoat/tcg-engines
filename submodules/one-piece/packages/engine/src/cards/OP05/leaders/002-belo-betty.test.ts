import { describe, test } from "vite-plus/test";
import { op05BeloBetty002 } from "../../../../../cards/src/cards/OP05/leaders/002-belo-betty.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-002 Belo Betty", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05BeloBetty002);
  });
});
