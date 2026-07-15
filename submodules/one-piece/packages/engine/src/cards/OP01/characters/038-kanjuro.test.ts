import { describe, test } from "vite-plus/test";
import { op01Kanjuro038 } from "../../../../../cards/src/cards/OP01/characters/038-kanjuro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-038 Kanjuro", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Kanjuro038);
  });
});
