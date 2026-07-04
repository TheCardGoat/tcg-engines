import { describe, test } from "vite-plus/test";
import { op10KinEmon026 } from "../../../../../cards/src/cards/OP10/characters/026-kin-emon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-026 Kin'emon", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10KinEmon026);
  });
});
