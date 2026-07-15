import { describe, test } from "vite-plus/test";
import { op14eb04Giolla064 } from "../../../../../cards/src/cards/OP14EB04/characters/064-giolla.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-064 Giolla", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Giolla064);
  });
});
