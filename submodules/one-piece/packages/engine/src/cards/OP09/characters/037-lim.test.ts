import { describe, test } from "vite-plus/test";
import { op09Lim037 } from "../../../../../cards/src/cards/OP09/characters/037-lim.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-037 Lim", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Lim037);
  });
});
