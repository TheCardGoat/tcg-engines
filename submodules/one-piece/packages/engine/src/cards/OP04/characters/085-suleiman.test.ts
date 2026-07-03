import { describe, test } from "vite-plus/test";
import { op04Suleiman085 } from "../../../../../cards/src/cards/OP04/characters/085-suleiman.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-085 Suleiman", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Suleiman085);
  });
});
