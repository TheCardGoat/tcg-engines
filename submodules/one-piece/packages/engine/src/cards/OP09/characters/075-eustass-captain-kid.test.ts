import { describe, test } from "vite-plus/test";
import { op09EustassCaptainKid075 } from "../../../../../cards/src/cards/OP09/characters/075-eustass-captain-kid.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-075 075-eustass-captain-kid", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09EustassCaptainKid075);
  });
});
