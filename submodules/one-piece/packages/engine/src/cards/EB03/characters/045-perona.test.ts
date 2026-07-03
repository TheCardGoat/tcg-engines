import { describe, test } from "vite-plus/test";
import { eb03Perona045 } from "../../../../../cards/src/cards/EB03/characters/045-perona.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-045 Perona", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Perona045);
  });
});
