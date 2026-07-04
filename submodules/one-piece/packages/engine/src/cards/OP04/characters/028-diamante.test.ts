import { describe, test } from "vite-plus/test";
import { op04Diamante028 } from "../../../../../cards/src/cards/OP04/characters/028-diamante.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-028 Diamante", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Diamante028);
  });
});
