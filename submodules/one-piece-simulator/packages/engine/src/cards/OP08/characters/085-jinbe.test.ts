import { describe, test } from "vite-plus/test";
import { op08Jinbe085 } from "../../../../../cards/src/cards/OP08/characters/085-jinbe.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-085 Jinbe", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Jinbe085);
  });
});
