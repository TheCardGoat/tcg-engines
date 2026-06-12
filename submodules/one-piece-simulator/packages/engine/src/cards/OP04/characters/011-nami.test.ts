import { describe, test } from "vite-plus/test";
import { op04Nami011 } from "../../../../../cards/src/cards/OP04/characters/011-nami.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-011 Nami", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Nami011);
  });
});
