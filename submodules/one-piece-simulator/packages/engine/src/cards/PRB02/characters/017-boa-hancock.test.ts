import { describe, test } from "vite-plus/test";
import { prb02BoaHancock017 } from "../../../../../cards/src/cards/PRB02/characters/017-boa-hancock.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("PRB02-017 Boa Hancock", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02BoaHancock017);
  });
});
