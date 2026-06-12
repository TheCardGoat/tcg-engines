import { describe, test } from "vite-plus/test";
import { op12Fullbody052 } from "../../../../../cards/src/cards/OP12/characters/052-fullbody.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-052 Fullbody", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Fullbody052);
  });
});
