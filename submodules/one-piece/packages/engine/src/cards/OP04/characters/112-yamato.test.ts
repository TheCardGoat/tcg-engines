import { describe, test } from "vite-plus/test";
import { op04Yamato112 } from "../../../../../cards/src/cards/OP04/characters/112-yamato.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-112 Yamato", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Yamato112);
  });
});
