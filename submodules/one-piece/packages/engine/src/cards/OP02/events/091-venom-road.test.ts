import { describe, test } from "vite-plus/test";
import { op02VenomRoad091 } from "../../../../../cards/src/cards/OP02/events/091-venom-road.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-091 Venom Road", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02VenomRoad091);
  });
});
