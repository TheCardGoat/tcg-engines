import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { snatchRed } from "../actions/snatch.ts";
import { electromagneticSomersaultRed } from "./electromagnetic-somersault.ts";

describe("Electromagnetic Somersault (ROS085/086/087) AAA", () => {
  it("happy: a chosen attack action returns to hand when the link resolves", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [snatchRed, electromagneticSomersaultRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(snatchRed);
    game.toReaction("attacker");
    Briar.play(electromagneticSomersaultRed);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: snatchRed.canonicalId,
      ordering: "listed",
    });

    expectFabCard(Briar, snatchRed).toBeIn("hand");
    expectFabCard(Briar, electromagneticSomersaultRed).toBeIn("graveyard");
  });

  it("boundary: choosing none leaves the attack in the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [snatchRed, electromagneticSomersaultRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(snatchRed);
    game.toReaction("attacker");
    Briar.play(electromagneticSomersaultRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Briar, snatchRed).toBeIn("graveyard");
  });

  it("timing: the chosen attack stays on the chain until link resolution", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [snatchRed, electromagneticSomersaultRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(snatchRed);
    game.toReaction("attacker");
    Briar.play(electromagneticSomersaultRed);

    expectFabCard(Briar, snatchRed).toBeIn("combatChain");
    expectFabCard(Briar, electromagneticSomersaultRed).toBeIn("stack");
  });
});
