import { describe, test } from "vite-plus/test";
import { op04Stussy084 } from "../../../../../cards/src/cards/OP04/characters/084-stussy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-084 Stussy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Stussy084);
  });
});
