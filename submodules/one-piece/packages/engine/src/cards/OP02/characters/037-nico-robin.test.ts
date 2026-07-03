import { describe, test } from "vite-plus/test";
import { op02NicoRobin037 } from "../../../../../cards/src/cards/OP02/characters/037-nico-robin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-037 Nico Robin", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02NicoRobin037);
  });
});
