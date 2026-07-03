import { describe, test } from "vite-plus/test";
import { op13StMarcusMars091 } from "../../../../../cards/src/cards/OP13/characters/091-st-marcus-mars.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-091 St. Marcus Mars", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13StMarcusMars091);
  });
});
