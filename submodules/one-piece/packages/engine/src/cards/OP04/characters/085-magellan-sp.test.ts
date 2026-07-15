import { describe, test } from "vite-plus/test";
import { op04MagellanSp085 } from "../../../../../cards/src/cards/OP04/characters/085-magellan-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-085 Magellan (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04MagellanSp085);
  });
});
