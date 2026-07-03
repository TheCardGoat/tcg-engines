import { describe, test } from "vite-plus/test";
import { op05Dalmatian046 } from "../../../../../cards/src/cards/OP05/characters/046-dalmatian.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-046 Dalmatian", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Dalmatian046);
  });
});
