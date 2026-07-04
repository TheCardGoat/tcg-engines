import { describe, test } from "vite-plus/test";
import { op09Buggy051 } from "../../../../../cards/src/cards/OP09/characters/051-buggy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-051 Buggy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Buggy051);
  });
});
