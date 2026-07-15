import { describe, test } from "vite-plus/test";
import { eb03NefeltariVivi024 } from "../../../../../cards/src/cards/EB03/characters/024-nefeltari-vivi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-024 Nefeltari Vivi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03NefeltariVivi024);
  });
});
