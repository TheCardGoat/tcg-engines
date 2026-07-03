import { describe, test } from "vite-plus/test";
import { op11Megalo112 } from "../../../../../cards/src/cards/OP11/characters/112-megalo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-112 Megalo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Megalo112);
  });
});
