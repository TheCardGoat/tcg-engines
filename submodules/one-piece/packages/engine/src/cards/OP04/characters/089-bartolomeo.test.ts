import { describe, test } from "vite-plus/test";
import { op04Bartolomeo089 } from "../../../../../cards/src/cards/OP04/characters/089-bartolomeo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-089 Bartolomeo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Bartolomeo089);
  });
});
