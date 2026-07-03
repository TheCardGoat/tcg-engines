import { describe, test } from "vite-plus/test";
import { op04Queen046 } from "../../../../../cards/src/cards/OP04/characters/046-queen.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-046 Queen", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Queen046);
  });
});
