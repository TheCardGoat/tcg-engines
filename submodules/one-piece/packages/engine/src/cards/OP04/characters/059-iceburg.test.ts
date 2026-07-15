import { describe, test } from "vite-plus/test";
import { op04Iceburg059 } from "../../../../../cards/src/cards/OP04/characters/059-iceburg.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-059 Iceburg", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Iceburg059);
  });
});
