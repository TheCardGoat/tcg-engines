import { describe, test } from "vite-plus/test";
import { op10SaintHoming093 } from "../../../../../cards/src/cards/OP10/characters/093-saint-homing.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-093 Saint Homing", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10SaintHoming093);
  });
});
