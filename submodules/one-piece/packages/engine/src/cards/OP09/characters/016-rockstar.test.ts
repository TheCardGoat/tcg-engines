import { describe, test } from "vite-plus/test";
import { op09Rockstar016 } from "../../../../../cards/src/cards/OP09/characters/016-rockstar.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-016 Rockstar", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Rockstar016);
  });
});
