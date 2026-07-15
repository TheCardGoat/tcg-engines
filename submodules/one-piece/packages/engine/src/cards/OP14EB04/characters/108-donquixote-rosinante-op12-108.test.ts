import { describe, test } from "vite-plus/test";
import { op14eb04DonquixoteRosinanteOp12108108 } from "../../../../../cards/src/cards/OP14EB04/characters/108-donquixote-rosinante-op12-108.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-108 Donquixote Rosinante - OP12-108", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04DonquixoteRosinanteOp12108108);
  });
});
