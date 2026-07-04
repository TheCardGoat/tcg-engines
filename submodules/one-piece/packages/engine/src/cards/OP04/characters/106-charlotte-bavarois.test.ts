import { describe, test } from "vite-plus/test";
import { op04CharlotteBavarois106 } from "../../../../../cards/src/cards/OP04/characters/106-charlotte-bavarois.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-106 Charlotte Bavarois", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04CharlotteBavarois106);
  });
});
