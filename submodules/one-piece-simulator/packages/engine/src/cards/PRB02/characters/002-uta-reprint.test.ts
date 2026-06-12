import { describe, test } from "vite-plus/test";
import { prb02UtaReprint002 } from "../../../../../cards/src/cards/PRB02/characters/002-uta-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-002 Uta (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02UtaReprint002);
  });
});
