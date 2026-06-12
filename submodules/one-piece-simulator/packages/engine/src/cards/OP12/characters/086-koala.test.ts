import { describe, test } from "vite-plus/test";
import { op12Koala086 } from "../../../../../cards/src/cards/OP12/characters/086-koala.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-086 Koala", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Koala086);
  });
});
