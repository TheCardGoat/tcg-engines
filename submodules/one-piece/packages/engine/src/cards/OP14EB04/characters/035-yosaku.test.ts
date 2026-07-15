import { describe, test } from "vite-plus/test";
import { op14eb04Yosaku035 } from "../../../../../cards/src/cards/OP14EB04/characters/035-yosaku.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-035 Yosaku", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Yosaku035);
  });
});
