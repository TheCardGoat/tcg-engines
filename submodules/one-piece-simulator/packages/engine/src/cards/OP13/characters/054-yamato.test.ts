import { describe, test } from "vite-plus/test";
import { op13Yamato054 } from "../../../../../cards/src/cards/OP13/characters/054-yamato.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-054 Yamato", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Yamato054);
  });
});
