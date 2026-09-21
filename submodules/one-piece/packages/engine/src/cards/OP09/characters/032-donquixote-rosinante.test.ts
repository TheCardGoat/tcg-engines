import { describe, test } from "vite-plus/test";
import { op09DonquixoteRosinante032 } from "../../../../../cards/src/cards/characters/op09-032-donquixote-rosinante.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-032 Donquixote Rosinante", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09DonquixoteRosinante032);
  });
});
