import { describe, test } from "vite-plus/test";
import { op03Buggy032 } from "../../../../../cards/src/cards/OP03/characters/032-buggy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-032 Buggy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Buggy032);
  });
});
