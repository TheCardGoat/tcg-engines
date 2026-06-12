import { describe, test } from "vite-plus/test";
import { op14eb04Porche037 } from "../../../../../cards/src/cards/OP14EB04/characters/037-porche.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-037 Porche", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Porche037);
  });
});
