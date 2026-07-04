import { describe, test } from "vite-plus/test";
import { eb02Karoo001 } from "../../../../../cards/src/cards/EB02/characters/001-karoo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-001 Karoo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Karoo001);
  });
});
