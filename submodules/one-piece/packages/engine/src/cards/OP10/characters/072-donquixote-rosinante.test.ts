import { describe, test } from "vite-plus/test";
import { op10DonquixoteRosinante072 } from "../../../../../cards/src/cards/OP10/characters/072-donquixote-rosinante.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-072 Donquixote Rosinante", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10DonquixoteRosinante072);
  });
});
