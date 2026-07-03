import { describe, test } from "vite-plus/test";
import { op02Vista011 } from "../../../../../cards/src/cards/OP02/characters/011-vista.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-011 Vista", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Vista011);
  });
});
