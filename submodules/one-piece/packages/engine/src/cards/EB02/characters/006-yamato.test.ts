import { describe, test } from "vite-plus/test";
import { eb02Yamato006 } from "../../../../../cards/src/cards/EB02/characters/006-yamato.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-006 Yamato", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Yamato006);
  });
});
