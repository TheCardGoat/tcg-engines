import { describe, test } from "vite-plus/test";
import { op04NefeltariVivi001 } from "../../../../../cards/src/cards/OP04/leaders/001-nefeltari-vivi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-001 Nefeltari Vivi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04NefeltariVivi001);
  });
});
