import { describe, test } from "vite-plus/test";
import { op05Lindbergh017 } from "../../../../../cards/src/cards/OP05/characters/017-lindbergh.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-017 Lindbergh", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Lindbergh017);
  });
});
