import { describe, test } from "vite-plus/test";
import { op02Sanji026 } from "../../../../../cards/src/cards/OP02/leaders/026-sanji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-026 Sanji", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Sanji026);
  });
});
