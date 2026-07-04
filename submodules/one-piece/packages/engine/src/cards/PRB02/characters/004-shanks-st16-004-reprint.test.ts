import { describe, test } from "vite-plus/test";
import { prb02ShanksSt16004Reprint004 } from "../../../../../cards/src/cards/PRB02/characters/004-shanks-st16-004-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST16-004 Shanks - ST16-004 (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02ShanksSt16004Reprint004);
  });
});
