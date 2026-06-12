import { describe, test } from "vite-plus/test";
import { op09NicoRobin062 } from "../../../../../cards/src/cards/OP09/leaders/062-nico-robin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-062 Nico Robin", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09NicoRobin062);
  });
});
