import { describe, test } from "vite-plus/test";
import { op02Shishilian032 } from "../../../../../cards/src/cards/OP02/characters/032-shishilian.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-032 Shishilian", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Shishilian032);
  });
});
