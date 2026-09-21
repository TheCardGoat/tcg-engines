import { describe, test } from "vite-plus/test";
import { op08SBear113 } from "../../../../../cards/src/cards/characters/op08-113-s-bear.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-113 S-Bear", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08SBear113);
  });
});
