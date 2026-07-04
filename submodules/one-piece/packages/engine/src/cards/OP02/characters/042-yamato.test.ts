import { describe, test } from "vite-plus/test";
import { op02Yamato042 } from "../../../../../cards/src/cards/OP02/characters/042-yamato.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-042 Yamato", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Yamato042);
  });
});
