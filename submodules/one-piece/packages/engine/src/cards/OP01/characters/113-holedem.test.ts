import { describe, test } from "vite-plus/test";
import { op01Holedem113 } from "../../../../../cards/src/cards/OP01/characters/113-holedem.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-113 Holedem", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Holedem113);
  });
});
