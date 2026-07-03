import { describe, test } from "vite-plus/test";
import { op05Koala006 } from "../../../../../cards/src/cards/OP05/characters/006-koala.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-006 Koala", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Koala006);
  });
});
