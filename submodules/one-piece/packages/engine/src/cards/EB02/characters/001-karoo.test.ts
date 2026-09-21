import { describe, test } from "vite-plus/test";
import { eb02Karoo001 } from "../../../../../cards/src/cards/characters/eb02-001-karoo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-001 Karoo", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Karoo001);
  });
});
