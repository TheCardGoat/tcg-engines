import { describe, test } from "vite-plus/test";
import { op09DonquixoteRosinante032 } from "../../../../../cards/src/cards/OP09/characters/032-donquixote-rosinante.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-032 Donquixote Rosinante", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09DonquixoteRosinante032);
  });
});
