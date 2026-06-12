import { describe, test } from "vite-plus/test";
import { op05Kuween024 } from "../../../../../cards/src/cards/OP05/characters/024-kuween.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-024 Kuween", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Kuween024);
  });
});
