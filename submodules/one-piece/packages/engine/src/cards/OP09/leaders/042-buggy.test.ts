import { describe, test } from "vite-plus/test";
import { op09Buggy042 } from "../../../../../cards/src/cards/OP09/leaders/042-buggy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-042 Buggy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Buggy042);
  });
});
