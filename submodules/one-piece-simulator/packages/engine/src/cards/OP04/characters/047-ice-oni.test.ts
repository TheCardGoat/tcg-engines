import { describe, test } from "vite-plus/test";
import { op04IceOni047 } from "../../../../../cards/src/cards/OP04/characters/047-ice-oni.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-047 Ice Oni", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04IceOni047);
  });
});
