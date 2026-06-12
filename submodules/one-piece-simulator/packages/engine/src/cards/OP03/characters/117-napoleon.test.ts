import { describe, test } from "vite-plus/test";
import { op03Napoleon117 } from "../../../../../cards/src/cards/OP03/characters/117-napoleon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-117 Napoleon", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Napoleon117);
  });
});
