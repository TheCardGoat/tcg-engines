import { describe, test } from "vite-plus/test";
import { op01Mr3Galdino085 } from "../../../../../cards/src/cards/characters/op01-085-mr-3-galdino.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-085 Mr.3 (Galdino)", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Mr3Galdino085);
  });
});
