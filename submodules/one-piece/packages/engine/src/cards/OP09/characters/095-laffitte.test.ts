import { describe, test } from "vite-plus/test";
import { op09Laffitte095 } from "../../../../../cards/src/cards/OP09/characters/095-laffitte.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-095 Laffitte", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Laffitte095);
  });
});
