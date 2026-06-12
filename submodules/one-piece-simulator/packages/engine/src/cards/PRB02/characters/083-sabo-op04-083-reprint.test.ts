import { describe, test } from "vite-plus/test";
import { prb02SaboOp04083Reprint083 } from "../../../../../cards/src/cards/PRB02/characters/083-sabo-op04-083-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-083 Sabo - OP04-083 (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02SaboOp04083Reprint083);
  });
});
