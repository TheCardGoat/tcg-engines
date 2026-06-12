import { describe, test } from "vite-plus/test";
import { op09Yasopp013 } from "../../../../../cards/src/cards/OP09/characters/013-yasopp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-013 Yasopp", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Yasopp013);
  });
});
