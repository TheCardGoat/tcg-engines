import { describe, test } from "vite-plus/test";
import { op01Yamato121 } from "../../../../../cards/src/cards/OP01/characters/121-yamato.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-121 Yamato", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Yamato121);
  });
});
