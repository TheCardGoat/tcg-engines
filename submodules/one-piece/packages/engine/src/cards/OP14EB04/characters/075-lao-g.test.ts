import { describe, test } from "vite-plus/test";
import { op14eb04LaoG075 } from "../../../../../cards/src/cards/OP14EB04/characters/075-lao-g.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-075 Lao.G", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04LaoG075);
  });
});
