import { describe, test } from "vite-plus/test";
import { op07SlaveArrow056 } from "../../../../../cards/src/cards/OP07/events/056-slave-arrow.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-056 Slave Arrow", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07SlaveArrow056);
  });
});
