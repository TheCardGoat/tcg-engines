import { describe, test } from "vite-plus/test";
import { op03DeathlyPoisonGasBombMh5038 } from "../../../../../cards/src/cards/OP03/events/038-deathly-poison-gas-bomb-mh5.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-038 Deathly Poison Gas Bomb MH5", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03DeathlyPoisonGasBombMh5038);
  });
});
