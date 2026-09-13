import {
  cintariSaber,
  courageOfBladehold,
  boltOfCourageRed,
  engulfingLightRed,
  luminaAscensionYellow,
  serBoltynBreakerOfDawn,
  snapdragonScalers,
} from "@tcg/flesh-and-blood-cards/simulator-scenario-cards";
import { spiritOfEirinaYellow } from "@tcg/flesh-and-blood-cards/cards/actions/spirit-of-eirina";
import { expectCombat, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { describe, expect, it } from "vitest";

import { presentRuntime } from "../projection";
import { getFabEngineScenario } from "./index";

function bootCombo() {
  const scenario = getFabEngineScenario("boltyn-sabers-combo");
  const match = scenario?.boot();
  if (!scenario || !match) throw new Error("Missing Sabers Boltyn combo scenario.");
  return { scenario, match, game: match.engine };
}

describe("FAB engine scenario · Sabers Boltyn combo", () => {
  it("starts before the combo with four cards in soul and Spirit of Eirina in the arena", () => {
    const { scenario, match, game } = bootCombo();
    const state = presentRuntime(match.runtime, match.player1Id);
    const ownNames = (zone: string) =>
      Object.values(state.cards)
        .filter((card) => card.ownerId === match.player1Id && card.zone === zone)
        .map((card) => state.cardDefinitions[card.cardId]?.name);

    expect(scenario.botMode).toBe("pass-only");
    expect(match.runtime.waitState()).toMatchObject({
      kind: "priority",
      playerId: match.player1Id,
    });
    expect(ownNames("hand")).toEqual([
      "Engulfing Light",
      "Bolt of Courage",
      "Lumina Ascension",
      "Lumina Ascension",
    ]);
    expect(ownNames("arsenal")).toEqual(["Lumina Ascension"]);
    expect(ownNames("chest")).toEqual(["Courage of Bladehold"]);
    expect(ownNames("legs")).toEqual(["Snapdragon Scalers"]);
    expect(ownNames("weapon")).toEqual(["Cintari Saber", "Cintari Saber"]);
    expect(ownNames("permanent")).toEqual(["Spirit Of Eirina"]);
    expect(game.getState().containers.zonesByPlayerId[match.player1Id]?.soul).toHaveLength(4);
    expect(state.soulCounts?.[match.player1Id]).toBe(4);
    expectFabCard(game.as(serBoltynBreakerOfDawn), spiritOfEirinaYellow).toBeIn("arena");
    expect(state.combat).toBeNull();
    expect(state.heroSignals[match.player1Id]).toEqual([]);
  });

  it("plays all eight Saber attacks and resolves 26 cards put into soul this turn", () => {
    const { match, game } = bootCombo();
    const Boltyn = game.as(serBoltynBreakerOfDawn);
    const opponentId = match.player2Id;
    for (const playerId of [match.player1Id, match.player2Id]) {
      const preferences = game.getState().automationPreferences[playerId];
      if (preferences) preferences.priorityMode = "always-hold";
    }

    Boltyn.playAttack(engulfingLightRed, { charge: true, chargeCard: boltOfCourageRed });
    game.toReaction("attacker");
    Boltyn.activate(snapdragonScalers);
    game.passBoth();
    expectCombat(game).toHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Boltyn).toHaveAP(1);

    Boltyn.activate(courageOfBladehold);
    game.untilIdle({ ordering: "listed" });

    Boltyn.play(luminaAscensionYellow, { index: 0 });
    game.untilIdle({ optionals: "accept", ordering: "listed" });
    Boltyn.play(luminaAscensionYellow, { index: 0 });
    game.untilIdle({ optionals: "accept", ordering: "listed" });
    Boltyn.playFromArsenal(luminaAscensionYellow);
    game.untilIdle({ optionals: "accept", ordering: "listed" });
    expect(game.getState().containers.zonesByPlayerId[match.player1Id]?.soul).toHaveLength(6);
    expectFabPlayer(Boltyn).toHaveAP(4);
    const sabers = [
      Boltyn.cardIn("weapon1", cintariSaber),
      Boltyn.cardIn("weapon2", cintariSaber),
    ] as const;

    for (let attackIndex = 0; attackIndex < 8; attackIndex += 1) {
      Boltyn.activateAttack(cintariSaber, { index: attackIndex % 2 });
      expect(game.combat()?.activeLink?.attackPower, `Saber attack ${attackIndex + 1}`).toBe(5);
      expectFabCard(Boltyn, sabers[attackIndex % 2]!).toHavePower(5);
      if (attackIndex < 7) {
        game.toReaction("attacker");
        Boltyn.activate(serBoltynBreakerOfDawn);
        game.helpers.resolveUntilIdle({
          entityTargets: "minimum",
          ordering: "listed",
          optionalBoolean: false,
        });
        expectFabPlayer(Boltyn).toHaveAP(4);
      } else {
        game.helpers.resolveRestOfCombat();
      }
    }

    const state = game.getState();
    expect(state.players[match.player1Id]?.history.turn.weaponAttacks).toBe(8);
    expect(state.players[match.player1Id]?.history.turn.attacksThisTurn).toBe(9);
    expect(
      Object.values(state.objects).filter((object) =>
        object.history.moves.some(
          (move) =>
            move.turnNumber === state.turnNumber &&
            move.to.zone === "soul" &&
            move.to.playerId === match.player1Id,
        ),
      ),
    ).toHaveLength(26);
    expectFabPlayer(Boltyn).toHaveLife(64);
    expectFabPlayer(Boltyn).toHaveAP(3);
    expect(state.players[opponentId]?.life).toBe(57);
    expectFabCard(Boltyn, courageOfBladehold).toBeIn("graveyard");
    expectFabCard(Boltyn, snapdragonScalers).toBeIn("graveyard");
    expect(presentRuntime(match.runtime, match.player1Id).heroSignals[match.player1Id]).toEqual([
      { kind: "flag", id: "charged" },
      { kind: "count", id: "weapon-attacks", value: 8 },
      { kind: "count", id: "soul-added", value: 26 },
    ]);
  }, 30_000);
});
