import { describe, test } from "vite-plus/test";
import { op11Caribou083 } from "../../../../../cards/src/cards/OP11/characters/083-caribou.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-083 Caribou", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Caribou083);
  });
});
