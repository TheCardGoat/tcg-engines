import { describe, test } from "vite-plus/test";
import { op02WhitebeardPirates022 } from "../../../../../cards/src/cards/OP02/events/022-whitebeard-pirates.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-022 Whitebeard Pirates", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02WhitebeardPirates022);
  });
});
