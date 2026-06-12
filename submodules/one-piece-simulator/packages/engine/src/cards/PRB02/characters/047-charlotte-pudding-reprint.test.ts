import { describe, test } from "vite-plus/test";
import { prb02CharlottePuddingReprint047 } from "../../../../../cards/src/cards/PRB02/characters/047-charlotte-pudding-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-047 Charlotte Pudding (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02CharlottePuddingReprint047);
  });
});
