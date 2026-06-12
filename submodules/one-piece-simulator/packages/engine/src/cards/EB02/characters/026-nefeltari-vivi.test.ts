import { describe, test } from "vite-plus/test";
import { eb02NefeltariVivi026 } from "../../../../../cards/src/cards/EB02/characters/026-nefeltari-vivi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-026 Nefeltari Vivi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02NefeltariVivi026);
  });
});
