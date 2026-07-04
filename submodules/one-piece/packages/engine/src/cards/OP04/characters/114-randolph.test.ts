import { describe, test } from "vite-plus/test";
import { op04Randolph114 } from "../../../../../cards/src/cards/OP04/characters/114-randolph.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-114 Randolph", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Randolph114);
  });
});
