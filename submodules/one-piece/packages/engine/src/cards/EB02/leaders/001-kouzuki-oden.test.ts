import { describe, test } from "vite-plus/test";
import { eb02KouzukiOden001 } from "../../../../../cards/src/cards/EB02/leaders/001-kouzuki-oden.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-001 Kouzuki Oden", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02KouzukiOden001);
  });
});
