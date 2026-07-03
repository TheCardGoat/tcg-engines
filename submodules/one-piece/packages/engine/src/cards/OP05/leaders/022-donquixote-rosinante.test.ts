import { describe, test } from "vite-plus/test";
import { op05DonquixoteRosinante022 } from "../../../../../cards/src/cards/OP05/leaders/022-donquixote-rosinante.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-022 Donquixote Rosinante", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05DonquixoteRosinante022);
  });
});
