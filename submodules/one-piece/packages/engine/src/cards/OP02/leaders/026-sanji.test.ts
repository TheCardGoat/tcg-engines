import { describe, test } from "vite-plus/test";
import { op02Sanji026 } from "../../../../../cards/src/cards/leaders/op02-026-sanji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-026 Sanji", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Sanji026);
  });
});
