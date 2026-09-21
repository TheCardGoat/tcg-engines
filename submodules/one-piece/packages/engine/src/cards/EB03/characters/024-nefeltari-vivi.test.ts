import { describe, test } from "vite-plus/test";
import { eb03NefeltariVivi024 } from "../../../../../cards/src/cards/characters/eb03-024-nefeltari-vivi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-024 Nefeltari Vivi", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03NefeltariVivi024);
  });
});
