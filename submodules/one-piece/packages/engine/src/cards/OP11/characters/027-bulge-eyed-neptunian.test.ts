import { describe, test } from "vite-plus/test";
import { op11BulgeEyedNeptunian027 } from "../../../../../cards/src/cards/OP11/characters/027-bulge-eyed-neptunian.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-027 Bulge-Eyed Neptunian", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11BulgeEyedNeptunian027);
  });
});
