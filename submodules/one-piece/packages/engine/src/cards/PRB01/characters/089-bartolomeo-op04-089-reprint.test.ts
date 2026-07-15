import { describe, test } from "vite-plus/test";
import { prb01BartolomeoOp04089Reprint089 } from "../../../../../cards/src/cards/PRB01/characters/089-bartolomeo-op04-089-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-089 Bartolomeo (OP04-089) (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01BartolomeoOp04089Reprint089);
  });
});
