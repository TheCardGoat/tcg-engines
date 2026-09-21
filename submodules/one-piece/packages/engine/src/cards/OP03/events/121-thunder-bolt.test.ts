import { describe, test } from "vite-plus/test";
import { op03ThunderBolt121 } from "../../../../../cards/src/cards/events/op03-121-thunder-bolt.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-121 Thunder Bolt", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03ThunderBolt121);
  });
});
