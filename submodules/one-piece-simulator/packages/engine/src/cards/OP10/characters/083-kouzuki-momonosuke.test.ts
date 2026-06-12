import { describe, test } from "vite-plus/test";
import { op10KouzukiMomonosuke083 } from "../../../../../cards/src/cards/OP10/characters/083-kouzuki-momonosuke.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-083 Kouzuki Momonosuke", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10KouzukiMomonosuke083);
  });
});
