import { describe, test } from "vite-plus/test";
import { op05KaidoSp044 } from "../../../../../cards/src/cards/OP05/characters/044-kaido-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-044 Kaido (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05KaidoSp044);
  });
});
