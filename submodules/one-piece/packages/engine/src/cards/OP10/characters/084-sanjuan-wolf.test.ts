import { describe, test } from "vite-plus/test";
import { op10SanjuanWolf084 } from "../../../../../cards/src/cards/characters/op10-084-sanjuan-wolf.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-084 Sanjuan.Wolf", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10SanjuanWolf084);
  });
});
