import { describe, test } from "vite-plus/test";
import { eb01Inazuma022 } from "../../../../../cards/src/cards/EB01/characters/022-inazuma.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-022 Inazuma", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Inazuma022);
  });
});
