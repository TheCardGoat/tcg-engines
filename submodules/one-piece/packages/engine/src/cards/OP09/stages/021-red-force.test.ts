import { describe, test } from "vite-plus/test";
import { op09RedForce021 } from "../../../../../cards/src/cards/OP09/stages/021-red-force.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-021 Red Force", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09RedForce021);
  });
});
