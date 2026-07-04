import { describe, test } from "vite-plus/test";
import { eb01Yamato007 } from "../../../../../cards/src/cards/EB01/characters/007-yamato.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-007 Yamato", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Yamato007);
  });
});
