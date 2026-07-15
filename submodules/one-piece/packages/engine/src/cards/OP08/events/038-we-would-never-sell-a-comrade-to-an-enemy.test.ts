import { describe, test } from "vite-plus/test";
import { op08WeWouldNeverSellAComradeToAnEnemy038 } from "../../../../../cards/src/cards/OP08/events/038-we-would-never-sell-a-comrade-to-an-enemy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-038 We Would Never Sell a Comrade to an Enemy!!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08WeWouldNeverSellAComradeToAnEnemy038);
  });
});
