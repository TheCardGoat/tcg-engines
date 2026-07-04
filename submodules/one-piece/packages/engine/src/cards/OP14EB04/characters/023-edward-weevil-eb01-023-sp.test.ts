import { describe, test } from "vite-plus/test";
import { op14eb04EdwardWeevilEb01023Sp023 } from "../../../../../cards/src/cards/OP14EB04/characters/023-edward-weevil-eb01-023-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-023 Edward Weevil - EB01-023 (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04EdwardWeevilEb01023Sp023);
  });
});
