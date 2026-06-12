import { describe, test } from "vite-plus/test";
import { op12Morgan035 } from "../../../../../cards/src/cards/OP12/characters/035-morgan.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-035 Morgan", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Morgan035);
  });
});
