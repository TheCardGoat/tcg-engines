import { describe, test } from "vite-plus/test";
import { op14eb04KinEmon024 } from "../../../../../cards/src/cards/OP14EB04/characters/024-kin-emon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-024 Kin'emon", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04KinEmon024);
  });
});
