import { describe, test } from "vite-plus/test";
import { eb03CharlottePudding035 } from "../../../../../cards/src/cards/EB03/characters/035-charlotte-pudding.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-035 Charlotte Pudding", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03CharlottePudding035);
  });
});
