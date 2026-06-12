import { describe, test } from "vite-plus/test";
import { op01ThunderBagua119 } from "../../../../../cards/src/cards/OP01/events/119-thunder-bagua.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-119 Thunder Bagua", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01ThunderBagua119);
  });
});
