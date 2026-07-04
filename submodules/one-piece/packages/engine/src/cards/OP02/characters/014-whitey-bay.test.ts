import { describe, test } from "vite-plus/test";
import { op02WhiteyBay014 } from "../../../../../cards/src/cards/OP02/characters/014-whitey-bay.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-014 Whitey Bay", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02WhiteyBay014);
  });
});
