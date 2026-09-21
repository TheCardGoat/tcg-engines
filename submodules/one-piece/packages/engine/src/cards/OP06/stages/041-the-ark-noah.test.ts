import { describe, test } from "vite-plus/test";
import { op06TheArkNoah041 } from "../../../../../cards/src/cards/stages/op06-041-the-ark-noah.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-041 The Ark Noah", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06TheArkNoah041);
  });
});
