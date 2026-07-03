import { describe, test } from "vite-plus/test";
import { op10TenLayerIgloo018 } from "../../../../../cards/src/cards/OP10/events/018-ten-layer-igloo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-018 Ten-Layer Igloo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10TenLayerIgloo018);
  });
});
