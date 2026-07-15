import { describe, test } from "vite-plus/test";
import { op12DonquixoteRosinante048 } from "../../../../../cards/src/cards/OP12/characters/048-donquixote-rosinante.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-048 Donquixote Rosinante", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12DonquixoteRosinante048);
  });
});
