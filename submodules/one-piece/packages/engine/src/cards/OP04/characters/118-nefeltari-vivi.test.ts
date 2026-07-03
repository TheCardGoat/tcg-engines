import { describe, test } from "vite-plus/test";
import { op04NefeltariVivi118 } from "../../../../../cards/src/cards/OP04/characters/118-nefeltari-vivi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-118 Nefeltari Vivi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04NefeltariVivi118);
  });
});
