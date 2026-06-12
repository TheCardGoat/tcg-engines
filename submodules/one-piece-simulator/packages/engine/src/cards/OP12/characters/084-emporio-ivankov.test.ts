import { describe, test } from "vite-plus/test";
import { op12EmporioIvankov084 } from "../../../../../cards/src/cards/OP12/characters/084-emporio-ivankov.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-084 Emporio.Ivankov", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12EmporioIvankov084);
  });
});
