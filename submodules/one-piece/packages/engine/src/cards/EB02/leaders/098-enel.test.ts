import { describe, test } from "vite-plus/test";
import { eb02Enel098 } from "../../../../../cards/src/cards/EB02/leaders/098-enel.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-098 Enel", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Enel098);
  });
});
