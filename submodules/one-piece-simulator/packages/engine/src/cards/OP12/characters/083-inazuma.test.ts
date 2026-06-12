import { describe, test } from "vite-plus/test";
import { op12Inazuma083 } from "../../../../../cards/src/cards/OP12/characters/083-inazuma.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-083 Inazuma", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Inazuma083);
  });
});
