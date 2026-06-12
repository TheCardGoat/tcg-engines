import { describe, test } from "vite-plus/test";
import { op03ThunderBolt121 } from "../../../../../cards/src/cards/OP03/events/121-thunder-bolt.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-121 Thunder Bolt", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03ThunderBolt121);
  });
});
