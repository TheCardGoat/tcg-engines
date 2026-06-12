import { describe, test } from "vite-plus/test";
import { op10SanjuanWolf084 } from "../../../../../cards/src/cards/OP10/characters/084-sanjuan-wolf.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-084 Sanjuan.Wolf", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10SanjuanWolf084);
  });
});
