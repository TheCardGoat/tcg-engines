import { describe, test } from "vite-plus/test";
import { prb01YamatoOp04112Reprint112 } from "../../../../../cards/src/cards/PRB01/characters/112-yamato-op04-112-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-112 Yamato (OP04-112) (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01YamatoOp04112Reprint112);
  });
});
