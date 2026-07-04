import { describe, test } from "vite-plus/test";
import { op05NefeltariVivi086 } from "../../../../../cards/src/cards/OP05/characters/086-nefeltari-vivi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-086 Nefeltari Vivi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05NefeltariVivi086);
  });
});
