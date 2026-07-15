import { describe, test } from "vite-plus/test";
import { op14eb04Nami031 } from "../../../../../cards/src/cards/OP14EB04/characters/031-nami.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-031 Nami", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Nami031);
  });
});
