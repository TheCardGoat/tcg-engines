import { describe, test } from "vite-plus/test";
import { op08DrumKingdom020 } from "../../../../../cards/src/cards/OP08/stages/020-drum-kingdom.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-020 Drum Kingdom", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08DrumKingdom020);
  });
});
