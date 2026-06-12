import { describe, test } from "vite-plus/test";
import { op11Neptune108 } from "../../../../../cards/src/cards/OP11/characters/108-neptune.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-108 Neptune", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Neptune108);
  });
});
