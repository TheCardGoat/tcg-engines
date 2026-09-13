import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { enigma } from "../heroes/enigma.ts";
import { innerChiBlue } from "../resources/inner-chi.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { mistHunterRed } from "./mist-hunter.ts";

describe("Mist Hunter (PEN143) AAA", () => {
  it("happy: hitting a Mystic hero banishes Inner Chi from their deck", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [mistHunterRed], actionPoints: 1, deck: 6 },
      { hero: enigma, life: 20, hand: [], deck: [innerChiBlue, brutalAssaultBlue] },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Enigma = game.as(enigma);

    Bravo.playAttack(mistHunterRed);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Enigma).toHaveLife(16);
    expect(Enigma.zone("banished")).toContain(innerChiBlue.canonicalId);
    expectFabCard(Bravo, mistHunterRed).toBeIn("graveyard");
  });

  it("boundary: hitting a non-Mystic hero does not search Inner Chi", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [mistHunterRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: [innerChiBlue] },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(mistHunterRed);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(16);
    expect(Dash.zone("deck")).toContain(innerChiBlue.canonicalId);
    expect(Dash.zone("banished")).not.toContain(innerChiBlue.canonicalId);
  });

  it("timing: a miss does not banish Inner Chi", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [mistHunterRed], actionPoints: 1, deck: 6 },
      {
        hero: enigma,
        life: 20,
        hand: [brutalAssaultBlue, brutalAssaultBlue],
        deck: [innerChiBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Enigma = game.as(enigma);

    Bravo.playAttack(mistHunterRed);
    game.advanceCombatTo("defend");
    Enigma.defendWith([brutalAssaultBlue, brutalAssaultBlue]);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Enigma).toHaveLife(20);
    expect(Enigma.zone("deck")).toContain(innerChiBlue.canonicalId);
  });
});
