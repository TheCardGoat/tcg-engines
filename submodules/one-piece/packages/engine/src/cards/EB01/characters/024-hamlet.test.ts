import { describe, test } from "vite-plus/test";
import { eb01Hamlet024 } from "../../../../../cards/src/cards/EB01/characters/024-hamlet.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-024 Hamlet", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Hamlet024);
  });
});
