import { describe, test } from "vite-plus/test";
import { op04Rabiyan113 } from "../../../../../cards/src/cards/OP04/characters/113-rabiyan.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-113 Rabiyan", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Rabiyan113);
  });
});
