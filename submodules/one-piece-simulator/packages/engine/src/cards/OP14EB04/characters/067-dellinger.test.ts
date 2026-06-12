import { describe, test } from "vite-plus/test";
import { op14eb04Dellinger067 } from "../../../../../cards/src/cards/OP14EB04/characters/067-dellinger.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-067 Dellinger", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Dellinger067);
  });
});
