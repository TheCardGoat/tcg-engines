import { describe, test } from "vite-plus/test";
import { op04Gyats080 } from "../../../../../cards/src/cards/OP04/characters/080-gyats.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-080 Gyats", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Gyats080);
  });
});
