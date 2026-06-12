import { describe, test } from "vite-plus/test";
import { op10RoronoaZoro038 } from "../../../../../cards/src/cards/OP10/characters/038-roronoa-zoro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-038 Roronoa Zoro", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10RoronoaZoro038);
  });
});
