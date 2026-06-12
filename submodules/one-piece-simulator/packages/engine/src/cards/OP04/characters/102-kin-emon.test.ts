import { describe, test } from "vite-plus/test";
import { op04KinEmon102 } from "../../../../../cards/src/cards/OP04/characters/102-kin-emon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-102 Kin'emon", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04KinEmon102);
  });
});
