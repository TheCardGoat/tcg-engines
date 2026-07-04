import { describe, test } from "vite-plus/test";
import { eb02Vista027 } from "../../../../../cards/src/cards/EB02/characters/027-vista.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-027 Vista", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Vista027);
  });
});
