import { describe, test } from "vite-plus/test";
import { prb02Mr3GaldinoPrb02009009 } from "../../../../../cards/src/cards/PRB02/characters/009-mr-3-galdino-prb02-009.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("PRB02-009 Mr.3(Galdino) - PRB02-009", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02Mr3GaldinoPrb02009009);
  });
});
