import { describe, test } from "vite-plus/test";
import { op09Mr3Galdino056 } from "../../../../../cards/src/cards/OP09/characters/056-mr-3-galdino.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-056 Mr.3(Galdino)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Mr3Galdino056);
  });
});
