import { describe, test } from "vite-plus/test";
import { op02EmporioIvankov049 } from "../../../../../cards/src/cards/OP02/leaders/049-emporio-ivankov.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-049 Emporio.Ivankov", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02EmporioIvankov049);
  });
});
