import { describe, test } from "vite-plus/test";
import { op05Enel098 } from "../../../../../cards/src/cards/OP05/leaders/098-enel.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-098 Enel", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Enel098);
  });
});
