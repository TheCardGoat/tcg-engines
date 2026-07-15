import { describe, test } from "vite-plus/test";
import { op04Ipponmatsu042 } from "../../../../../cards/src/cards/OP04/characters/042-ipponmatsu.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-042 Ipponmatsu", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Ipponmatsu042);
  });
});
