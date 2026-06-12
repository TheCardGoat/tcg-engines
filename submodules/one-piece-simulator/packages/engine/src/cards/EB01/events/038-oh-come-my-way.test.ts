import { describe, test } from "vite-plus/test";
import { eb01OhComeMyWay038 } from "../../../../../cards/src/cards/EB01/events/038-oh-come-my-way.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-038 Oh Come My Way", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01OhComeMyWay038);
  });
});
