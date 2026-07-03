import { describe, test } from "vite-plus/test";
import { op05DonquixoteRosinante030 } from "../../../../../cards/src/cards/OP05/characters/030-donquixote-rosinante.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-030 Donquixote Rosinante", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05DonquixoteRosinante030);
  });
});
