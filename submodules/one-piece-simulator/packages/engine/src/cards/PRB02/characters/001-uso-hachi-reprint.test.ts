import { describe, test } from "vite-plus/test";
import { prb02UsoHachiReprint001 } from "../../../../../cards/src/cards/PRB02/characters/001-uso-hachi-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST18-001 Uso-Hachi (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02UsoHachiReprint001);
  });
});
