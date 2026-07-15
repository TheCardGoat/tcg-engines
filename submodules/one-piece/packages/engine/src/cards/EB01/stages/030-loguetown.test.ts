import { describe, test } from "vite-plus/test";
import { eb01Loguetown030 } from "../../../../../cards/src/cards/EB01/stages/030-loguetown.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-030 Loguetown", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Loguetown030);
  });
});
