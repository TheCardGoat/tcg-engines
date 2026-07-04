import { describe, test } from "vite-plus/test";
import { op14eb04Mystoms017 } from "../../../../../cards/src/cards/OP14EB04/characters/017-mystoms.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-017 Mystoms", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Mystoms017);
  });
});
