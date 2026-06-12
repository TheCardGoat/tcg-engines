import { describe, test } from "vite-plus/test";
import { eb02Magellan038 } from "../../../../../cards/src/cards/EB02/characters/038-magellan.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-038 Magellan", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Magellan038);
  });
});
