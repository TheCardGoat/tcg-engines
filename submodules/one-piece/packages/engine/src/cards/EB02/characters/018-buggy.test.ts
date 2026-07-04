import { describe, test } from "vite-plus/test";
import { eb02Buggy018 } from "../../../../../cards/src/cards/EB02/characters/018-buggy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-018 Buggy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Buggy018);
  });
});
