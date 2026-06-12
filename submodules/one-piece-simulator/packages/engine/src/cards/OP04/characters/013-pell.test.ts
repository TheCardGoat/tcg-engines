import { describe, test } from "vite-plus/test";
import { op04Pell013 } from "../../../../../cards/src/cards/OP04/characters/013-pell.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-013 Pell", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Pell013);
  });
});
