import { describe, test } from "vite-plus/test";
import { op02DonquixoteRosinante108 } from "../../../../../cards/src/cards/characters/op02-108-donquixote-rosinante.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-108 Donquixote Rosinante", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02DonquixoteRosinante108);
  });
});
