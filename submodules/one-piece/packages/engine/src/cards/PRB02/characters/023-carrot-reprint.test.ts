import { describe, test } from "vite-plus/test";
import { prb02CarrotReprint023 } from "../../../../../cards/src/cards/PRB02/characters/023-carrot-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-023 Carrot (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02CarrotReprint023);
  });
});
