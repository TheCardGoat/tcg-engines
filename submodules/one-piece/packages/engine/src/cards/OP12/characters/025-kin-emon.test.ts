import { describe, test } from "vite-plus/test";
import { op12KinEmon025 } from "../../../../../cards/src/cards/OP12/characters/025-kin-emon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-025 Kin'emon", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12KinEmon025);
  });
});
