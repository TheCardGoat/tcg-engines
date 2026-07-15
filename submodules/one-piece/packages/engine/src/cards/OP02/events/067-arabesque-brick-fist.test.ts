import { describe, test } from "vite-plus/test";
import { op02ArabesqueBrickFist067 } from "../../../../../cards/src/cards/OP02/events/067-arabesque-brick-fist.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-067 Arabesque Brick Fist", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02ArabesqueBrickFist067);
  });
});
