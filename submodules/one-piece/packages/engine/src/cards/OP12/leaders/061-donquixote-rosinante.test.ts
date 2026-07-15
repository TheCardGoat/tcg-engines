import { describe, test } from "vite-plus/test";
import { op12DonquixoteRosinante061 } from "../../../../../cards/src/cards/OP12/leaders/061-donquixote-rosinante.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-061 Donquixote Rosinante", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12DonquixoteRosinante061);
  });
});
