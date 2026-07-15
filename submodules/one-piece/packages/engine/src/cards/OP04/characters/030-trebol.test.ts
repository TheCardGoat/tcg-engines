import { describe, test } from "vite-plus/test";
import { op04Trebol030 } from "../../../../../cards/src/cards/OP04/characters/030-trebol.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-030 Trebol", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Trebol030);
  });
});
