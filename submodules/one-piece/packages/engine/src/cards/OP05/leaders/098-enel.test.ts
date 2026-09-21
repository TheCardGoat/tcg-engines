import { describe, test } from "vite-plus/test";
import { op05Enel098 } from "../../../../../cards/src/cards/leaders/op05-098-enel.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-098 Enel", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Enel098);
  });
});
