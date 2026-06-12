import { describe, test } from "vite-plus/test";
import { op13SaintShalria086 } from "../../../../../cards/src/cards/OP13/characters/086-saint-shalria.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-086 Saint Shalria", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13SaintShalria086);
  });
});
