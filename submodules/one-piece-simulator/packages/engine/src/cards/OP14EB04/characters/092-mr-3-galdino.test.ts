import { describe, test } from "vite-plus/test";
import { op14eb04Mr3Galdino092 } from "../../../../../cards/src/cards/OP14EB04/characters/092-mr-3-galdino.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-092 Mr.3(Galdino)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Mr3Galdino092);
  });
});
