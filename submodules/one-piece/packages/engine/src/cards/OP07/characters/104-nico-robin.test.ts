import { describe, test } from "vite-plus/test";
import { op07NicoRobin104 } from "../../../../../cards/src/cards/OP07/characters/104-nico-robin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-104 Nico Robin", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07NicoRobin104);
  });
});
