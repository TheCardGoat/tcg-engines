import { describe, test } from "vite-plus/test";
import { op02MobyDick024 } from "../../../../../cards/src/cards/OP02/stages/024-moby-dick.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-024 Moby Dick", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02MobyDick024);
  });
});
