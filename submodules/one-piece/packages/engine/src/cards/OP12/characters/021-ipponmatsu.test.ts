import { describe, test } from "vite-plus/test";
import { op12Ipponmatsu021 } from "../../../../../cards/src/cards/OP12/characters/021-ipponmatsu.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-021 Ipponmatsu", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Ipponmatsu021);
  });
});
