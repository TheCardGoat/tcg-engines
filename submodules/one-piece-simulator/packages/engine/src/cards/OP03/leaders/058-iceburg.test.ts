import { describe, test } from "vite-plus/test";
import { op03Iceburg058 } from "../../../../../cards/src/cards/OP03/leaders/058-iceburg.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-058 Iceburg", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Iceburg058);
  });
});
