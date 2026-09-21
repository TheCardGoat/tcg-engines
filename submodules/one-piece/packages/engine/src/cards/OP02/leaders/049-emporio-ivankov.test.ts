import { describe, test } from "vite-plus/test";
import { op02EmporioIvankov049 } from "../../../../../cards/src/cards/leaders/op02-049-emporio-ivankov.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-049 Emporio.Ivankov", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02EmporioIvankov049);
  });
});
