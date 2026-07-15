import { describe, test } from "vite-plus/test";
import { op08Pedro030 } from "../../../../../cards/src/cards/OP08/characters/030-pedro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-030 Pedro", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Pedro030);
  });
});
