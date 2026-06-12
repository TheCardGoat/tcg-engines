import { describe, test } from "vite-plus/test";
import { op05Conis104 } from "../../../../../cards/src/cards/OP05/characters/104-conis.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-104 Conis", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Conis104);
  });
});
