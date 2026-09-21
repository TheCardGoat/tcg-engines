import { describe, test } from "vite-plus/test";
import { op03Helmeppo091 } from "../../../../../cards/src/cards/characters/op03-091-helmeppo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-091 Helmeppo", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Helmeppo091);
  });
});
