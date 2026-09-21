import { describe, test } from "vite-plus/test";
import { op03Brannew089 } from "../../../../../cards/src/cards/characters/op03-089-brannew.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-089 Brannew", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Brannew089);
  });
});
