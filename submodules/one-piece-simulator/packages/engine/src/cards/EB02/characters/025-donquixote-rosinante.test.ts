import { describe, test } from "vite-plus/test";
import { eb02DonquixoteRosinante025 } from "../../../../../cards/src/cards/EB02/characters/025-donquixote-rosinante.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-025 Donquixote Rosinante", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02DonquixoteRosinante025);
  });
});
