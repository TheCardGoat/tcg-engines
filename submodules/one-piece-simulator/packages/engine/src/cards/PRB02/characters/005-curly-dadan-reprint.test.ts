import { describe, test } from "vite-plus/test";
import { prb02CurlyDadanReprint005 } from "../../../../../cards/src/cards/PRB02/characters/005-curly-dadan-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-005 Curly.Dadan (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02CurlyDadanReprint005);
  });
});
