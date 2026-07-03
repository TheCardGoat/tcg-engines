import { describe, test } from "vite-plus/test";
import { prb01KoalaReprint006 } from "../../../../../cards/src/cards/PRB01/characters/006-koala-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-006 Koala (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01KoalaReprint006);
  });
});
