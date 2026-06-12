import { describe, test } from "vite-plus/test";
import { op02KinEmon025 } from "../../../../../cards/src/cards/OP02/leaders/025-kin-emon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-025 Kin'emon", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02KinEmon025);
  });
});
