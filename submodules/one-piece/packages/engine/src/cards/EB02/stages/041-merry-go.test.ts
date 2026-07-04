import { describe, test } from "vite-plus/test";
import { eb02MerryGo041 } from "../../../../../cards/src/cards/EB02/stages/041-merry-go.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-041 Merry Go", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02MerryGo041);
  });
});
