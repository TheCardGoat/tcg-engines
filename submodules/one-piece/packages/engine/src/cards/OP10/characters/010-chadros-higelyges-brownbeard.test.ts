import { describe, test } from "vite-plus/test";
import { op10ChadrosHigelygesBrownbeard010 } from "../../../../../cards/src/cards/OP10/characters/010-chadros-higelyges-brownbeard.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-010 Chadros.Higelyges (Brownbeard)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10ChadrosHigelygesBrownbeard010);
  });
});
