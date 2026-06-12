import { describe, test } from "vite-plus/test";
import { op09DonquixoteRosinanteSp119 } from "../../../../../cards/src/cards/OP09/characters/119-donquixote-rosinante-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-119 Donquixote Rosinante (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09DonquixoteRosinanteSp119);
  });
});
