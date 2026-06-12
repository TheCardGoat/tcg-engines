import { describe, test } from "vite-plus/test";
import { op11GumGumElephantGatling038 } from "../../../../../cards/src/cards/OP11/events/038-gum-gum-elephant-gatling.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-038 Gum-Gum Elephant Gatling", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11GumGumElephantGatling038);
  });
});
