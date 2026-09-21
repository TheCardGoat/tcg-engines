import { describe, test } from "vite-plus/test";
import { op06Eldoraggo070 } from "../../../../../cards/src/cards/characters/op06-070-eldoraggo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-070 Eldoraggo", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Eldoraggo070);
  });
});
