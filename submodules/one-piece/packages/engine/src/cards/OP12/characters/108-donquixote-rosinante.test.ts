import { describe, test } from "vite-plus/test";
import { op12DonquixoteRosinante108 } from "../../../../../cards/src/cards/OP12/characters/108-donquixote-rosinante.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-108 Donquixote Rosinante", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12DonquixoteRosinante108);
  });
});
