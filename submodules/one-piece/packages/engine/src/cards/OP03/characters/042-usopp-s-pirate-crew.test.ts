import { describe, test } from "vite-plus/test";
import { op03UsoppSPirateCrew042 } from "../../../../../cards/src/cards/characters/op03-042-usopp-s-pirate-crew.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-042 Usopp's Pirate Crew", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03UsoppSPirateCrew042);
  });
});
