import { describe, test } from "vite-plus/test";
import { op09Sabo027 } from "../../../../../cards/src/cards/characters/op09-027-sabo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-027 Sabo", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Sabo027);
  });
});
