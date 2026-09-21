import { describe, test } from "vite-plus/test";
import { op09Shanks001 } from "../../../../../cards/src/cards/leaders/op09-001-shanks.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-001 Shanks", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Shanks001);
  });
});
