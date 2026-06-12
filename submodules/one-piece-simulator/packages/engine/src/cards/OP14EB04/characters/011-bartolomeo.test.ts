import { describe, test } from "vite-plus/test";
import { op14eb04Bartolomeo011 } from "../../../../../cards/src/cards/OP14EB04/characters/011-bartolomeo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-011 Bartolomeo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Bartolomeo011);
  });
});
