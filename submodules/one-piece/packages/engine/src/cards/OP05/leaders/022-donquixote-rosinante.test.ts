import { describe, test } from "vite-plus/test";
import { op05DonquixoteRosinante022 } from "../../../../../cards/src/cards/leaders/op05-022-donquixote-rosinante.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-022 Donquixote Rosinante", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05DonquixoteRosinante022);
  });
});
