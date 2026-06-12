import { describe, test } from "vite-plus/test";
import { op06ThrillerBark098 } from "../../../../../cards/src/cards/OP06/stages/098-thriller-bark.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-098 Thriller Bark", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06ThrillerBark098);
  });
});
