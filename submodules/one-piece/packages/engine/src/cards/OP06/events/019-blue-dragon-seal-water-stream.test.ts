import { describe, test } from "vite-plus/test";
import { op06BlueDragonSealWaterStream019 } from "../../../../../cards/src/cards/OP06/events/019-blue-dragon-seal-water-stream.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-019 Blue Dragon Seal Water Stream", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06BlueDragonSealWaterStream019);
  });
});
