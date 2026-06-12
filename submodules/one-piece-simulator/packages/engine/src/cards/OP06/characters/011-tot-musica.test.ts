import { describe, test } from "vite-plus/test";
import { op06TotMusica011 } from "../../../../../cards/src/cards/OP06/characters/011-tot-musica.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-011 Tot Musica", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06TotMusica011);
  });
});
