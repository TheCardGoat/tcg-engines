import { describe, test } from "vite-plus/test";
import { op03TropicalTorment120 } from "../../../../../cards/src/cards/events/op03-120-tropical-torment.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-120 Tropical Torment", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03TropicalTorment120);
  });
});
