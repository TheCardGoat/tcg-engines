import { describe, test } from "vite-plus/test";
import { op14eb04Johnny028 } from "../../../../../cards/src/cards/OP14EB04/characters/028-johnny.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-028 Johnny", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Johnny028);
  });
});
