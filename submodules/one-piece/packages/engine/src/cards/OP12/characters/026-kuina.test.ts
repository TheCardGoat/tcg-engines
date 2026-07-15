import { describe, test } from "vite-plus/test";
import { op12Kuina026 } from "../../../../../cards/src/cards/OP12/characters/026-kuina.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-026 Kuina", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Kuina026);
  });
});
