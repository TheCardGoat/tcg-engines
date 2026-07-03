import { describe, test } from "vite-plus/test";
import { op09Jinbe067 } from "../../../../../cards/src/cards/OP09/characters/067-jinbe.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-067 Jinbe", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Jinbe067);
  });
});
