import { describe, test } from "vite-plus/test";
import { op03Fukurou088 } from "../../../../../cards/src/cards/OP03/characters/088-fukurou.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-088 Fukurou", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Fukurou088);
  });
});
