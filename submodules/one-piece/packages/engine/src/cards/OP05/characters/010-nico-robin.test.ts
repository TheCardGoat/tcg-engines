import { describe, test } from "vite-plus/test";
import { op05NicoRobin010 } from "../../../../../cards/src/cards/characters/op05-010-nico-robin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-010 Nico Robin", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05NicoRobin010);
  });
});
