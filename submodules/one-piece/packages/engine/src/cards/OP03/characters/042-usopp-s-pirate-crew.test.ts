import { describe, test } from "vite-plus/test";
import { op03UsoppSPirateCrew042 } from "../../../../../cards/src/cards/OP03/characters/042-usopp-s-pirate-crew.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-042 Usopp's Pirate Crew", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03UsoppSPirateCrew042);
  });
});
