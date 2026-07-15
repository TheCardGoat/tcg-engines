import { describe, test } from "vite-plus/test";
import { op01ParadiseWaterfall057 } from "../../../../../cards/src/cards/OP01/events/057-paradise-waterfall.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-057 Paradise Waterfall", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01ParadiseWaterfall057);
  });
});
