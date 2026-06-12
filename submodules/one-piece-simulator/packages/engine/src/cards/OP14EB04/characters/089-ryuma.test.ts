import { describe, test } from "vite-plus/test";
import { op14eb04Ryuma089 } from "../../../../../cards/src/cards/OP14EB04/characters/089-ryuma.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-089 Ryuma", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Ryuma089);
  });
});
