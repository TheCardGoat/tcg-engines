import { describe, test } from "vite-plus/test";
import { op02Koby098 } from "../../../../../cards/src/cards/OP02/characters/098-koby.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-098 Koby", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Koby098);
  });
});
