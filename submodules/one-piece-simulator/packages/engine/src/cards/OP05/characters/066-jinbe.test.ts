import { describe, test } from "vite-plus/test";
import { op05Jinbe066 } from "../../../../../cards/src/cards/OP05/characters/066-jinbe.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-066 Jinbe", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Jinbe066);
  });
});
