import { describe, test } from "vite-plus/test";
import { op14eb04Usopp022 } from "../../../../../cards/src/cards/OP14EB04/characters/022-usopp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-022 Usopp", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Usopp022);
  });
});
