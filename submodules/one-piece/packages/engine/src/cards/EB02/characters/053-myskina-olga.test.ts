import { describe, test } from "vite-plus/test";
import { eb02MyskinaOlga053 } from "../../../../../cards/src/cards/EB02/characters/053-myskina-olga.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-053 Myskina Olga", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02MyskinaOlga053);
  });
});
