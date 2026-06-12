import { describe, test } from "vite-plus/test";
import { op13Sabo004 } from "../../../../../cards/src/cards/OP13/leaders/004-sabo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-004 Sabo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Sabo004);
  });
});
