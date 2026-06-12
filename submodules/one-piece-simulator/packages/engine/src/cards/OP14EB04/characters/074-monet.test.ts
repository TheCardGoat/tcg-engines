import { describe, test } from "vite-plus/test";
import { op14eb04Monet074 } from "../../../../../cards/src/cards/OP14EB04/characters/074-monet.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-074 Monet", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Monet074);
  });
});
