import { describe, test } from "vite-plus/test";
import { op06Germa66078 } from "../../../../../cards/src/cards/OP06/events/078-germa-66.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-078 GERMA 66", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Germa66078);
  });
});
