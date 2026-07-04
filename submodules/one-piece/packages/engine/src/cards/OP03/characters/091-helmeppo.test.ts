import { describe, test } from "vite-plus/test";
import { op03Helmeppo091 } from "../../../../../cards/src/cards/OP03/characters/091-helmeppo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-091 Helmeppo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Helmeppo091);
  });
});
