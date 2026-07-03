import { describe, test } from "vite-plus/test";
import { eb02BeloBetty002 } from "../../../../../cards/src/cards/EB02/leaders/002-belo-betty.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-002 Belo Betty", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02BeloBetty002);
  });
});
