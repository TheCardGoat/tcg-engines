import { describe, test } from "vite-plus/test";
import { op05Ulti043 } from "../../../../../cards/src/cards/OP05/characters/043-ulti.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-043 Ulti", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Ulti043);
  });
});
