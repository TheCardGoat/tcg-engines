import { describe, test } from "vite-plus/test";
import { eb01KouzukiOden001 } from "../../../../../cards/src/cards/EB01/leaders/001-kouzuki-oden.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-001 Kouzuki Oden", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01KouzukiOden001);
  });
});
