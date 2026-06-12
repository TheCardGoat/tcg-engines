import { describe, test } from "vite-plus/test";
import { prb02Nami012 } from "../../../../../cards/src/cards/PRB02/characters/012-nami.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("PRB02-012 Nami", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02Nami012);
  });
});
