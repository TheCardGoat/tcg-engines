import { describe, test } from "vite-plus/test";
import { op05NicoRobin010 } from "../../../../../cards/src/cards/OP05/characters/010-nico-robin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-010 Nico Robin", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05NicoRobin010);
  });
});
