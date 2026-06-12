import { describe, test } from "vite-plus/test";
import { op11Nami054 } from "../../../../../cards/src/cards/OP11/characters/054-nami.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-054 Nami", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Nami054);
  });
});
