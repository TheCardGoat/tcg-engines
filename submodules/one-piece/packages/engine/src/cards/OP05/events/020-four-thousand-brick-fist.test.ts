import { describe, test } from "vite-plus/test";
import { op05FourThousandBrickFist020 } from "../../../../../cards/src/cards/OP05/events/020-four-thousand-brick-fist.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-020 Four Thousand-Brick Fist", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05FourThousandBrickFist020);
  });
});
