import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../shared/test-recipients.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { maleficIncantationRed } from "./malefic-incantation.ts";

describe("maleficIncantation family AAA", () => {
  it("happy: enters with 3 verse counters; playing an attack action removes one", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [maleficIncantationRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(maleficIncantationRed);
    game.helpers.resolveUntilIdle();
    expectFabCard(Briar, maleficIncantationRed).toBeIn("arena").toHaveCounters(3, "verse");
    expectFabPlayer(Briar).toHaveAP(1);

    Briar.attackWith(brutalAssaultBlue);
    expectFabCard(Briar, maleficIncantationRed).toHaveCounters(2, "verse");
  });

  it("boundary: a non-attack action does not remove a verse counter", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [maleficIncantationRed, maleficIncantationRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(maleficIncantationRed);
    game.helpers.resolveUntilIdle();
    const seated = Briar.ref({
      kind: "instance",
      instanceId: Briar.findCardInZone("arena", maleficIncantationRed),
      canonicalId: maleficIncantationRed.canonicalId,
      ownerId: Briar.id,
    });
    Briar.play(maleficIncantationRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Briar, seated).toHaveCounters(3, "verse");
  });
});
