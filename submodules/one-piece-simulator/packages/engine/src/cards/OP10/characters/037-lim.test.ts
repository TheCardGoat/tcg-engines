import { describe, test } from "vite-plus/test";
import { op10Lim037 } from "../../../../../cards/src/cards/OP10/characters/037-lim.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-037 Lim", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Lim037);
  });
});
