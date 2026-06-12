import { describe, test } from "vite-plus/test";
import { op14eb04Arlong042 } from "../../../../../cards/src/cards/OP14EB04/characters/042-arlong.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-042 Arlong", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Arlong042);
  });
});
