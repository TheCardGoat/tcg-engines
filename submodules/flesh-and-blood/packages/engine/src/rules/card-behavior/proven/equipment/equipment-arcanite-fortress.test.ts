/**
 * ROS211 Arcanite Fortress — Generic Chest Guardwell.
 *
 * Printed:
 *   This card's {d} is equal to the number of equipment you control with
 *   Arcanite in their name.
 *   Spellvoid X, where X is the number of equipment you control with Arcanite
 *   in their name.
 *   Guardwell
 *
 * Reasoning (case-by-case):
 * 1. Continuous set-base {d} from count of Arcanite-named equipment controlled.
 * 2. MODEL: filter was subtypes:["Equipment"] (never matches) → types:["Equipment"].
 * 3. ENGINE: cards-in-zone zone:permanent used strict catalog equality, so
 *    equipment seats (equipment-chest/head/…) never counted. Fixed permanent
 *    umbrella via catalogZoneMatchesTargetZones (same as object targets).
 * 4. Spellvoid X live amount on keyword (not type-"x" placeholder) + continuous
 *    re-grant — PEN030 sibling. Alone X=1; with Skullcap X=2.
 * 5. Guardwell: defend with d>0 stamps −1{d} counter path.
 *
 * Status: ✅ d scales with Arcanite equip; Spellvoid X; Guardwell; remodel+engine.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { arcaniteFortress } from "../../../../../../cards/src/cards/equipment/arcanite-fortress.ts";
import { arcaniteSkullcap } from "../../../../../../cards/src/cards/equipment/arcanite-skullcap.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";

const LIFE = 20;
const SNATCH = 4;

const arcaneBolt2 = {
  canonicalId: "trainer-arcane-bolt-ros211",
  types: ["Wizard", "Action"],
  cost: 0,
  arcane: 2,
  keywords: [] as const,
};

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
    if (game.answerForcedDecision()) continue;
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: false },
        },
      });
      continue;
    }
    if (decision?.kind === "option") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "option", optionIds: decision.options.map((option) => option.id) },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const pick = decision.candidates[0];
      if (!pick && (decision.min ?? 1) > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "entity-target",
            instanceIds: pick ? [pick.instanceId] : [],
          },
        },
      });
      continue;
    }
    if (decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      try {
        game.exec({ move: "pass", actorId: prio, payload: {} });
      } catch {
        return;
      }
      continue;
    }
    return;
  }
}

function chestDefense(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
): number | undefined {
  const state = game.getState();
  const instanceId = state.containers.zonesByPlayerId[playerId]?.chest.find(
    (id) => state.objects[id]?.canonicalId === arcaniteFortress.canonicalId,
  );
  if (!instanceId) return undefined;
  const view = buildFabRulesView(state);
  return view.object({
    instanceId,
    incarnation: state.objects[instanceId]!.incarnation,
  })?.current.numeric.defense;
}

describe("arcanite-fortress (ROS211)", () => {
  it("core mechanic: {d} = Arcanite equipment count; alone 1, with Skullcap 2", () => {
    const alone = FabTestEngine.start(
      { hero: bravo, chest: [arcaniteFortress], deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(chestDefense(alone, alone.as(bravo).id)).toBe(1);

    const pair = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        chest: [arcaniteFortress],
        head: [arcaniteSkullcap],
        life: LIFE,
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = pair.as(bravo);
    expect(chestDefense(pair, Defender.id)).toBe(2);

    // Defend for 2 vs snatch 4 → 2 damage; Guardwell keeps chest with −1{d}.
    pair.as(dash).attackWith(snatchRed);
    Defender.defendWith(arcaniteFortress);
    pair.helpers.resolveRestOfCombat();
    drain(pair);

    expect(Defender.life()).toBe(LIFE - (SNATCH - 2));
    expect(Defender.zone("chest")).toContain(arcaniteFortress.canonicalId);
  });

  it("core mechanic: Spellvoid X — alone prevents 1 and destroys fortress", () => {
    // Fortress alone → Spellvoid 1. Arcane 2 → prevent 1, destroy, take 1.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [arcaneBolt2],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [arcaniteFortress],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    game.as(bravo).play(arcaneBolt2);
    drain(game);

    expect(game.as(dash).life()).toBe(LIFE - 1);
    expect(game.as(dash).zone("graveyard")).toContain(arcaniteFortress.canonicalId);
    expect(game.as(dash).zone("chest")).not.toContain(arcaniteFortress.canonicalId);
  });

  it("boundaries: model types Equipment + nameContains; live spellvoid count; Guardwell", () => {
    const a1 = arcaniteFortress.base.abilities?.[0];
    const a2 = arcaniteFortress.base.abilities?.[1];
    expect(a1?.kind).toBe("static");
    expect(a2?.kind).toBe("static");
    if (a1?.kind !== "static" || a2?.kind !== "static" || !a1.effect || !a2.effect) return;
    expect(a1.staticKind).toBe("continuous");
    expect(a1.effect).toMatchObject({
      type: "modify-numeric",
      property: "defense",
      op: "set-base",
      amount: {
        type: "count",
        what: "cards-in-zone",
        zone: "permanent",
        filter: {
          and: [{ typeBox: { types: ["Equipment"] } }, { nameContains: "Arcanite" }],
        },
      },
      duration: "permanent",
    });
    expect(a2.effect).toMatchObject({
      type: "grant-property",
      property: {
        kind: "keyword",
        keyword: {
          name: "spellvoid",
          value: {
            type: "count",
            what: "cards-in-zone",
            zone: "permanent",
            filter: {
              and: [{ typeBox: { types: ["Equipment"] } }, { nameContains: "Arcanite" }],
            },
          },
        },
      },
    });
    const kwSpellvoid = arcaniteFortress.base.keywords?.find(
      (k) => typeof k !== "string" && k.name === "spellvoid",
    );
    expect(kwSpellvoid).toMatchObject({
      name: "spellvoid",
      value: {
        type: "count",
        what: "cards-in-zone",
        zone: "permanent",
      },
    });
    expect(
      arcaniteFortress.base.keywords?.some((k) => typeof k !== "string" && k.name === "guardwell"),
    ).toBe(true);
  });
});
