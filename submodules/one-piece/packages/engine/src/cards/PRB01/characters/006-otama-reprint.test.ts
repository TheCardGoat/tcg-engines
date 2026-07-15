import { describe, test } from "vite-plus/test";
import { prb01OtamaReprint006 } from "../../../../../cards/src/cards/PRB01/characters/006-otama-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-006 Otama (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01OtamaReprint006);
  });
});
