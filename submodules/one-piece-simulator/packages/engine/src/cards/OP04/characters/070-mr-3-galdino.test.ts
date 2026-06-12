import { describe, test } from "vite-plus/test";
import { op04Mr3Galdino070 } from "../../../../../cards/src/cards/OP04/characters/070-mr-3-galdino.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-070 Mr.3 (Galdino)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Mr3Galdino070);
  });
});
