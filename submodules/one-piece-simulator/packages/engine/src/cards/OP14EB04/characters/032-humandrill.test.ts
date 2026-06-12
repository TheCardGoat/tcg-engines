import { describe, test } from "vite-plus/test";
import { op14eb04Humandrill032 } from "../../../../../cards/src/cards/OP14EB04/characters/032-humandrill.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-032 Humandrill", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Humandrill032);
  });
});
