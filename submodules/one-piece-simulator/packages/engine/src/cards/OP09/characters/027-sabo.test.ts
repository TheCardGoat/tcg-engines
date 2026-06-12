import { describe, test } from "vite-plus/test";
import { op09Sabo027 } from "../../../../../cards/src/cards/OP09/characters/027-sabo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-027 Sabo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Sabo027);
  });
});
