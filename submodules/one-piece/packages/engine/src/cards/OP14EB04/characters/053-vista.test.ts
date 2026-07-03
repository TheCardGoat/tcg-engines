import { describe, test } from "vite-plus/test";
import { op14eb04Vista053 } from "../../../../../cards/src/cards/OP14EB04/characters/053-vista.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-053 Vista", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Vista053);
  });
});
