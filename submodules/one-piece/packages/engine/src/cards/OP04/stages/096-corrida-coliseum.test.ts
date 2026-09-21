import { describe, test } from "vite-plus/test";
import { op04CorridaColiseum096 } from "../../../../../cards/src/cards/stages/op04-096-corrida-coliseum.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-096 Corrida Coliseum", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04CorridaColiseum096);
  });
});
