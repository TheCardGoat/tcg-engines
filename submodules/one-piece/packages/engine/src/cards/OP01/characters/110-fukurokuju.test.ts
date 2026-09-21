import { describe, test } from "vite-plus/test";
import { op01Fukurokuju110 } from "../../../../../cards/src/cards/characters/op01-110-fukurokuju.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-110 Fukurokuju", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Fukurokuju110);
  });
});
