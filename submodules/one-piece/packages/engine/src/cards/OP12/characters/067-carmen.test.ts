import { describe, test } from "vite-plus/test";
import { op12Carmen067 } from "../../../../../cards/src/cards/OP12/characters/067-carmen.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-067 Carmen", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Carmen067);
  });
});
