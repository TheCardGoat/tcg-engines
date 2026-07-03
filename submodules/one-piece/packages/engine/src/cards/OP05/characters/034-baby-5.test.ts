import { describe, test } from "vite-plus/test";
import { op05Baby5034 } from "../../../../../cards/src/cards/OP05/characters/034-baby-5.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-034 Baby 5", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Baby5034);
  });
});
