import { describe, test } from "vite-plus/test";
import { op05Sakazuki041 } from "../../../../../cards/src/cards/OP05/leaders/041-sakazuki.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-041 Sakazuki", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Sakazuki041);
  });
});
