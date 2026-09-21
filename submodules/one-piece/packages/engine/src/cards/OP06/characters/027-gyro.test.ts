import { describe, test } from "vite-plus/test";
import { op06Gyro027 } from "../../../../../cards/src/cards/characters/op06-027-gyro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-027 Gyro", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Gyro027);
  });
});
