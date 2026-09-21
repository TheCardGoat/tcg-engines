import { describe, test } from "vite-plus/test";
import { eb03NefeltariVivi001 } from "../../../../../cards/src/cards/leaders/eb03-001-nefeltari-vivi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-001 Nefeltari Vivi", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03NefeltariVivi001);
  });
});
