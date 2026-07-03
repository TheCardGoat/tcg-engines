import { describe, test } from "vite-plus/test";
import { eb03NefeltariVivi001 } from "../../../../../cards/src/cards/EB03/leaders/001-nefeltari-vivi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-001 Nefeltari Vivi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03NefeltariVivi001);
  });
});
