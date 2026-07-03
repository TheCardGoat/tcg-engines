import { describe, test } from "vite-plus/test";
import { prb02RebeccaReprint091 } from "../../../../../cards/src/cards/PRB02/characters/091-rebecca-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-091 Rebecca (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02RebeccaReprint091);
  });
});
