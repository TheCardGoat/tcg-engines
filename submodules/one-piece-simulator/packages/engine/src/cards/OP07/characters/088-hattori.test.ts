import { describe, test } from "vite-plus/test";
import { op07Hattori088 } from "../../../../../cards/src/cards/OP07/characters/088-hattori.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-088 Hattori", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Hattori088);
  });
});
