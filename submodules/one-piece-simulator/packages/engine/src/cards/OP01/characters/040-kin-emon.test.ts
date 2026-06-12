import { describe, test } from "vite-plus/test";
import { op01KinEmon040 } from "../../../../../cards/src/cards/OP01/characters/040-kin-emon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-040 Kin'emon", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01KinEmon040);
  });
});
