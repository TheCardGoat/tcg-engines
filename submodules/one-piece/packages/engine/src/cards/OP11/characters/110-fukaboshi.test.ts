import { describe, test } from "vite-plus/test";
import { op11Fukaboshi110 } from "../../../../../cards/src/cards/OP11/characters/110-fukaboshi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-110 Fukaboshi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Fukaboshi110);
  });
});
