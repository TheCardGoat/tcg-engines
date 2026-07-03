import { describe, test } from "vite-plus/test";
import { op01DemonFace056 } from "../../../../../cards/src/cards/OP01/events/056-demon-face.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-056 Demon Face", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01DemonFace056);
  });
});
