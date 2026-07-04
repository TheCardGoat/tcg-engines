import { describe, test } from "vite-plus/test";
import { eb02DonquixoteRosinante022 } from "../../../../../cards/src/cards/EB02/leaders/022-donquixote-rosinante.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-022 Donquixote Rosinante", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02DonquixoteRosinante022);
  });
});
