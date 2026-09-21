import { describe, test } from "vite-plus/test";
import { op06TenguyamaHitetsu108 } from "../../../../../cards/src/cards/characters/op06-108-tenguyama-hitetsu.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-108 Tenguyama Hitetsu", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06TenguyamaHitetsu108);
  });
});
