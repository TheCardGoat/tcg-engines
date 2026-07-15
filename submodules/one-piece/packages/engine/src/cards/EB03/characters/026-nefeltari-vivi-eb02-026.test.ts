import { describe, test } from "vite-plus/test";
import { eb03NefeltariViviEb02026026 } from "../../../../../cards/src/cards/EB03/characters/026-nefeltari-vivi-eb02-026.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-026 Nefeltari Vivi - EB02-026", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03NefeltariViviEb02026026);
  });
});
