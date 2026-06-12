import { describe, test } from "vite-plus/test";
import { op05Sabo001 } from "../../../../../cards/src/cards/OP05/leaders/001-sabo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-001 Sabo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Sabo001);
  });
});
