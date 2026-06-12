import { describe, test } from "vite-plus/test";
import { op06EmporioIvankov003 } from "../../../../../cards/src/cards/OP06/characters/003-emporio-ivankov.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-003 Emporio.Ivankov", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06EmporioIvankov003);
  });
});
