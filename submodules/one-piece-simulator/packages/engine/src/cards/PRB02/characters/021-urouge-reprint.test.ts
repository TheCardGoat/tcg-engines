import { describe, test } from "vite-plus/test";
import { prb02UrougeReprint021 } from "../../../../../cards/src/cards/PRB02/characters/021-urouge-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-021 Urouge (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02UrougeReprint021);
  });
});
