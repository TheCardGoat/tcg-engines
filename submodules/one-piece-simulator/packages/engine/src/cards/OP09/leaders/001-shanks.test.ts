import { describe, test } from "vite-plus/test";
import { op09Shanks001 } from "../../../../../cards/src/cards/OP09/leaders/001-shanks.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-001 Shanks", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Shanks001);
  });
});
