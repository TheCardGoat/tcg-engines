import { describe, test } from "vite-plus/test";
import { op02Fullbody111 } from "../../../../../cards/src/cards/characters/op02-111-fullbody.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-111 Fullbody", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Fullbody111);
  });
});
