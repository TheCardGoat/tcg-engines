import { describe, test } from "vite-plus/test";
import { op04Igaram002 } from "../../../../../cards/src/cards/OP04/characters/002-igaram.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-002 Igaram", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Igaram002);
  });
});
