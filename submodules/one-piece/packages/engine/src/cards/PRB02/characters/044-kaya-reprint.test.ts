import { describe, test } from "vite-plus/test";
import { prb02KayaReprint044 } from "../../../../../cards/src/cards/PRB02/characters/044-kaya-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-044 Kaya (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02KayaReprint044);
  });
});
