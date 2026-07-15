import { describe, test } from "vite-plus/test";
import { op10KinEmon027 } from "../../../../../cards/src/cards/OP10/characters/027-kin-emon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-027 Kin'emon", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10KinEmon027);
  });
});
