import { describe, test } from "vite-plus/test";
import { op04Franky063 } from "../../../../../cards/src/cards/OP04/characters/063-franky.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-063 Franky", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Franky063);
  });
});
