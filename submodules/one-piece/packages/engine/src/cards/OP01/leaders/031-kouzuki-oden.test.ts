import { describe, test } from "vite-plus/test";
import { op01KouzukiOden031 } from "../../../../../cards/src/cards/OP01/leaders/031-kouzuki-oden.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-031 Kouzuki Oden", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01KouzukiOden031);
  });
});
