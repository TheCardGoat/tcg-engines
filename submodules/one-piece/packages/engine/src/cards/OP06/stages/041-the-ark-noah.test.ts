import { describe, test } from "vite-plus/test";
import { op06TheArkNoah041 } from "../../../../../cards/src/cards/OP06/stages/041-the-ark-noah.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-041 The Ark Noah", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06TheArkNoah041);
  });
});
