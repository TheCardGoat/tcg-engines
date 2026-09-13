/**
 * HVY198-201 Adversity equipment — public AAA for "may only defend".
 *
 * Each condition is a positive defend requirement evaluated against the
 * controller of the attack. Player one supplies the negative case without
 * satisfying it. Player two supplies the positive case: player one passes,
 * then player two's Start Phase draws a card (Face) or destroys its token
 * (Confront, Embrace, Overcome) before attacking.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine, type FabCardLike, type FabPlayerSetup } from "../../../../index.ts";
import { bravo, dash, snatchRed, tomeOfFyendalYellow } from "../../../fixtures.ts";
import { faceAdversity } from "../../../../../../cards/src/cards/equipment/face-adversity.ts";
import { confrontAdversity } from "../../../../../../cards/src/cards/equipment/confront-adversity.ts";
import { embraceAdversity } from "../../../../../../cards/src/cards/equipment/embrace-adversity.ts";
import { overcomeAdversity } from "../../../../../../cards/src/cards/equipment/overcome-adversity.ts";
import { agility } from "../../../../../../cards/src/cards/tokens/agility.ts";
import { might } from "../../../../../../cards/src/cards/tokens/might.ts";
import { vigor } from "../../../../../../cards/src/cards/tokens/vigor.ts";

const LIFE = 20;
const SNATCH_POWER = 4;
const INTERACTIVE = { autoPassPriority: false } as const;

type EquipmentZone = "head" | "chest" | "arms" | "legs";
type Requirement = "draw" | "vigor" | "might" | "agility";

interface AdversityCase {
  readonly name: string;
  readonly equipment: FabCardLike;
  readonly zone: EquipmentZone;
  readonly requirement: Requirement;
  readonly token?: FabCardLike;
  readonly expectedDamage: number;
}

const ADVERSITY_CASES: readonly AdversityCase[] = [
  {
    name: "Face Adversity (HVY198)",
    equipment: faceAdversity,
    zone: "head",
    requirement: "draw",
    expectedDamage: SNATCH_POWER - 2,
  },
  {
    name: "Confront Adversity (HVY199)",
    equipment: confrontAdversity,
    zone: "chest",
    requirement: "vigor",
    token: vigor,
    expectedDamage: SNATCH_POWER - 2,
  },
  {
    name: "Embrace Adversity (HVY200)",
    equipment: embraceAdversity,
    zone: "arms",
    requirement: "might",
    token: might,
    expectedDamage: SNATCH_POWER + 1 - 2,
  },
  {
    name: "Overcome Adversity (HVY201)",
    equipment: overcomeAdversity,
    zone: "legs",
    requirement: "agility",
    token: agility,
    expectedDamage: SNATCH_POWER - 2,
  },
];

function withEquipment(zone: EquipmentZone, equipment: FabCardLike): FabPlayerSetup {
  const setup: FabPlayerSetup = { hero: dash, life: LIFE, deck: 8 };
  setup[zone] = [equipment];
  return setup;
}

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
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
    if (decision?.kind === "entity-target") {
      const candidate = decision.candidates[0];
      if (!candidate && (decision.min ?? 1) > 0)
        throw new Error("required target has no candidate");
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: candidate ? [candidate.instanceId] : [] },
        },
      });
      continue;
    }
    if (decision) throw new Error(`unhandled decision kind ${decision.kind}`);
    if (
      !game.combat()?.open &&
      game.getState().rulesStack.length === 0 &&
      !game.getState().rulesProcess
    )
      return;
    game.passBoth();
  }
  throw new Error("game did not become idle");
}

function attackerSetup(token?: FabCardLike): FabPlayerSetup {
  return {
    hero: bravo,
    hand: [snatchRed],
    ...(token ? { arena: [token] } : {}),
    actionPoints: 1,
    deck: 8,
  };
}

describe.each(ADVERSITY_CASES)(
  "$name",
  ({ equipment, expectedDamage, requirement, token, zone }) => {
    it("rejects a player-one attack when its condition has not been satisfied", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 8 },
        withEquipment(zone, equipment),
        INTERACTIVE,
      );
      const Attacker = game.as(bravo);
      const Defender = game.as(dash);

      Attacker.attackWith(snatchRed);

      const rejected = Defender.expectBlockRejected(equipment);
      expect(rejected.accepted).toBe(false);
      expect(Defender.zone(zone)).toContain(equipment.canonicalId);
    });

    it("permits defense once the attack controller has satisfied the condition", () => {
      if (requirement === "draw") {
        const game = FabTestEngine.start(
          {
            hero: bravo,
            hand: [tomeOfFyendalYellow, snatchRed],
            resourcePoints: 1,
            actionPoints: 2,
            deck: 8,
          },
          withEquipment(zone, equipment),
          INTERACTIVE,
        );
        const Attacker = game.as(bravo);
        const Defender = game.as(dash);

        Attacker.play(tomeOfFyendalYellow);
        drain(game);
        expect(game.getState().players[Attacker.id]?.history.turn.cardsDrawn).toBeGreaterThan(0);
        Attacker.attackWith(snatchRed);
        Defender.defendWith(equipment);
        drain(game);
        game.helpers.resolveRestOfCombat();

        expect(Defender.life()).toBe(LIFE - expectedDamage);
        expect(Defender.zone(zone)).not.toContain(equipment.canonicalId);
        expect(Defender.zone("graveyard")).toContain(equipment.canonicalId);
        return;
      }

      const game = FabTestEngine.start(
        withEquipment(zone, equipment),
        attackerSetup(token),
        INTERACTIVE,
      );
      const Defender = game.as(dash);
      const Attacker = game.as(bravo);

      expect(game.getState().activePlayerId).toBe(Defender.id);
      if (token) {
        const tokenInstanceId = game.getState().containers.zonesByPlayerId[Attacker.id]!.arena[0]!;
        expect(game.getState().objects[tokenInstanceId]?.objectKind).toBe("created-token");
      }
      Defender.endTurn();
      drain(game);
      expect(game.getState().activePlayerId).toBe(Attacker.id);

      expect(Attacker.zone("arena")).not.toContain(token!.canonicalId);
      expect(game.getState().players[Attacker.id]?.history.turn.destroyedTokenNames).toContain(
        requirement,
      );

      Attacker.attackWith(snatchRed);
      Defender.defendWith(equipment);
      drain(game);
      game.helpers.resolveRestOfCombat();

      expect(Defender.life()).toBe(LIFE - expectedDamage);
      expect(Defender.zone(zone)).not.toContain(equipment.canonicalId);
      expect(Defender.zone("graveyard")).toContain(equipment.canonicalId);
    });
  },
);
