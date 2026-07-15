import { describe, test } from "vite-plus/test";
import { op01Arlong063 } from "../../../../../cards/src/cards/OP01/characters/063-arlong.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-063 Arlong", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Arlong063);
  });
});
