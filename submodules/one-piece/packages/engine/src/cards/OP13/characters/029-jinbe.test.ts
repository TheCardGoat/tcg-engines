import { describe, test } from "vite-plus/test";
import { op13Jinbe029 } from "../../../../../cards/src/cards/OP13/characters/029-jinbe.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-029 Jinbe", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Jinbe029);
  });
});
