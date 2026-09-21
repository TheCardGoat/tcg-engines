import { describe, test } from "vite-plus/test";
import { op13Sabo004 } from "../../../../../cards/src/cards/leaders/op13-004-sabo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-004 Sabo", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Sabo004);
  });
});
