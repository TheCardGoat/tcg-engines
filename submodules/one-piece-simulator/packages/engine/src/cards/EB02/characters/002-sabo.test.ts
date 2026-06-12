import { describe, test } from "vite-plus/test";
import { eb02Sabo002 } from "../../../../../cards/src/cards/EB02/characters/002-sabo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-002 Sabo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Sabo002);
  });
});
