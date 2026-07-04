import { describe, test } from "vite-plus/test";
import { op03Gaimon043 } from "../../../../../cards/src/cards/OP03/characters/043-gaimon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-043 Gaimon", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Gaimon043);
  });
});
