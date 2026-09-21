import { describe, test } from "vite-plus/test";
import { op02EmporioIvankov051 } from "../../../../../cards/src/cards/characters/op02-051-emporio-ivankov.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-051 Emporio.Ivankov", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02EmporioIvankov051);
  });
});
