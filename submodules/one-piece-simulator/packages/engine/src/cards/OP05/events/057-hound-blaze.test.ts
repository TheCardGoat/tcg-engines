import { describe, test } from "vite-plus/test";
import { op05HoundBlaze057 } from "../../../../../cards/src/cards/OP05/events/057-hound-blaze.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-057 Hound Blaze", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05HoundBlaze057);
  });
});
