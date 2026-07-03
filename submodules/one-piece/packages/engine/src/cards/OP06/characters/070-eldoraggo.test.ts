import { describe, test } from "vite-plus/test";
import { op06Eldoraggo070 } from "../../../../../cards/src/cards/OP06/characters/070-eldoraggo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-070 Eldoraggo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Eldoraggo070);
  });
});
