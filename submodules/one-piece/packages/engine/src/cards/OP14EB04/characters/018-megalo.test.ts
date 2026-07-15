import { describe, test } from "vite-plus/test";
import { op14eb04Megalo018 } from "../../../../../cards/src/cards/OP14EB04/characters/018-megalo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-018 Megalo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Megalo018);
  });
});
