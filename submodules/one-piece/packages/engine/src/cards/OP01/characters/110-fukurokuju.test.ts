import { describe, test } from "vite-plus/test";
import { op01Fukurokuju110 } from "../../../../../cards/src/cards/OP01/characters/110-fukurokuju.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-110 Fukurokuju", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Fukurokuju110);
  });
});
