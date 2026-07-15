import { describe, test } from "vite-plus/test";
import { op08SBear113 } from "../../../../../cards/src/cards/OP08/characters/113-s-bear.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-113 S-Bear", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08SBear113);
  });
});
