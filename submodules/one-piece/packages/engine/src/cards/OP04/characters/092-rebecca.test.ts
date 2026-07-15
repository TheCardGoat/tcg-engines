import { describe, test } from "vite-plus/test";
import { op04Rebecca092 } from "../../../../../cards/src/cards/OP04/characters/092-rebecca.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-092 Rebecca", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Rebecca092);
  });
});
