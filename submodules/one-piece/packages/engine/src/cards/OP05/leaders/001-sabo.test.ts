import { describe, test } from "vite-plus/test";
import { op05Sabo001 } from "../../../../../cards/src/cards/leaders/op05-001-sabo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-001 Sabo", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Sabo001);
  });
});
