import { describe, test } from "vite-plus/test";
import { op13Buggy072 } from "../../../../../cards/src/cards/OP13/characters/072-buggy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-072 Buggy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Buggy072);
  });
});
