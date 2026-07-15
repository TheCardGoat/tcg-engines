import { describe, test } from "vite-plus/test";
import { op08ImperialFlame094 } from "../../../../../cards/src/cards/OP08/events/094-imperial-flame.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-094 Imperial Flame", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08ImperialFlame094);
  });
});
