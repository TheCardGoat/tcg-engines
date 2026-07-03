import { describe, test } from "vite-plus/test";
import { op13SunnyKun026 } from "../../../../../cards/src/cards/OP13/characters/026-sunny-kun.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-026 Sunny-Kun", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13SunnyKun026);
  });
});
