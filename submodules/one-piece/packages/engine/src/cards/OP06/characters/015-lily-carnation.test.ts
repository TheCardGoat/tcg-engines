import { describe, test } from "vite-plus/test";
import { op06LilyCarnation015 } from "../../../../../cards/src/cards/OP06/characters/015-lily-carnation.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-015 Lily Carnation", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06LilyCarnation015);
  });
});
