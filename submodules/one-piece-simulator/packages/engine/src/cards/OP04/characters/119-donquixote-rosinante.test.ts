import { describe, test } from "vite-plus/test";
import { op04DonquixoteRosinante119 } from "../../../../../cards/src/cards/OP04/characters/119-donquixote-rosinante.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-119 Donquixote Rosinante", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04DonquixoteRosinante119);
  });
});
