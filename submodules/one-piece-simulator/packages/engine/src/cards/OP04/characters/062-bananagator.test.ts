import { describe, test } from "vite-plus/test";
import { op04Bananagator062 } from "../../../../../cards/src/cards/OP04/characters/062-bananagator.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-062 Bananagator", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Bananagator062);
  });
});
