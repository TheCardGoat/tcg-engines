import { describe, test } from "vite-plus/test";
import { op12Lindbergh095 } from "../../../../../cards/src/cards/OP12/characters/095-lindbergh.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-095 Lindbergh", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Lindbergh095);
  });
});
