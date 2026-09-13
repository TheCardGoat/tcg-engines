import { describe, expect, it } from "vitest";
import {
  grandArchiveObjectId,
  grandArchivePlayerId,
  grandArchiveStackItemId,
} from "../../game/identity.ts";
import type { GrandArchiveLegalCommand } from "../../commands/legal-commands.ts";
import {
  chooseGrandArchiveCompiledLineCommand,
  compileGrandArchiveLine,
  rankGrandArchiveLines,
} from "./line-compiler.ts";
import type { GrandArchiveHeuristicCard, GrandArchiveHeuristicSnapshot } from "./types.ts";

const p1 = grandArchivePlayerId("p1");
const p2 = grandArchivePlayerId("p2");
const attackerId = grandArchiveObjectId("attacker");
const championId = grandArchiveObjectId("champion-target");
const allyId = grandArchiveObjectId("ally-target");
const protectedPaymentId = grandArchiveObjectId("protected-payment");
const expendablePaymentId = grandArchiveObjectId("expendable-payment");
const stackItemId = grandArchiveStackItemId("stack-item");
const attackCardId = grandArchiveObjectId("attack-card");
const firstWeaponId = grandArchiveObjectId("first-weapon");
const secondWeaponId = grandArchiveObjectId("second-weapon");

function card(
  id: ReturnType<typeof grandArchiveObjectId>,
  controllerId: typeof p1 | typeof p2,
  types: GrandArchiveHeuristicCard["types"],
  stats: { readonly power?: number; readonly life?: number; readonly damage?: number } = {},
): GrandArchiveHeuristicCard {
  return {
    id,
    definitionId: id,
    name: id,
    lineageName: types.includes("CHAMPION") ? id : null,
    ownerId: controllerId,
    controllerId,
    zone: "field",
    facing: "face-up",
    isToken: false,
    hostId: null,
    banishedBySourceId: null,
    supertypes: [],
    types,
    classes: ["MAGE"],
    subtypes: [],
    elements: ["NORM"],
    keywords: [],
    states: new Set(["awake"]),
    activationStates: new Set(),
    counters: {},
    costKind: "reserve",
    cost: 0,
    level: null,
    power: stats.power ?? null,
    life: stats.life ?? null,
    durability: null,
    damage: stats.damage ?? 0,
    ready: true,
  };
}

function snapshot(): GrandArchiveHeuristicSnapshot {
  return {
    playerId: p1,
    mode: "standard",
    matchStatus: "playing",
    winnerIds: [],
    gameStates: {},
    self: {
      id: p1,
      name: "Player One",
      turnOrder: 0,
      hasTakenFirstTurn: true,
      lost: false,
      conceded: false,
      states: {},
      mastery: null,
      champion: null,
    },
    opponents: [],
    turnPlayerId: p1,
    isTurnPlayer: true,
    phase: "main",
    turnNumber: 3,
    stackDepth: 0,
    opportunityHolderId: p1,
    decisionKind: null,
    combat: null,
    history: { turn: [], phase: [], combat: null, resolution: null },
    mainDeckCount: 0,
    revealedMainDeckCards: [],
    hand: [],
    memory: [],
    materialDeck: [],
    graveyard: [],
    banishment: [],
    field: [card(attackerId, p1, ["ALLY"], { power: 5, life: 4 })],
    intent: [],
    pantheon: [],
    innerLineage: [],
    loaded: [],
    effectsStackCards: [],
    opponentsField: [
      card(championId, p2, ["CHAMPION"], { life: 20, damage: 16 }),
      card(allyId, p2, ["ALLY"], { life: 2 }),
    ],
    visibleOpponentCards: [],
    champion: null,
  };
}

function legal(command: GrandArchiveLegalCommand["command"]): GrandArchiveLegalCommand {
  return { playerId: p1, stateVersion: 7, command, label: command.move };
}

describe("Grand Archive heuristic line compiler", () => {
  it("prefers a lethal champion attack using current damage over another legal attack", () => {
    const allyAttack = legal({ move: "declare-attack", attackerId, targetIds: [allyId] });
    const championAttack = legal({
      move: "declare-attack",
      attackerId,
      targetIds: [championId],
    });
    const pass = legal({ move: "pass" });
    const ranked = rankGrandArchiveLines(snapshot(), [allyAttack, pass, championAttack]);

    expect(ranked.map((candidate) => candidate.command)).toEqual([
      championAttack,
      allyAttack,
      pass,
    ]);
    expect(ranked[0]).toMatchObject({ kind: "attack", sourceId: attackerId });
  });

  it("returns the canonical legal-list member and never falls through to concession", () => {
    const pass = legal({ move: "pass" });
    const concede = legal({ move: "concede" });
    const line = compileGrandArchiveLine(snapshot(), [concede, pass]);

    expect(line?.kind).toBe("pass");
    expect(chooseGrandArchiveCompiledLineCommand(line, [concede, pass])).toBe(pass);
  });

  it("layers exact profile hints and finite score adjustments over generic legal lines", () => {
    const championAttack = legal({
      move: "declare-attack",
      attackerId,
      targetIds: [championId],
    });
    const allyAttack = legal({ move: "declare-attack", attackerId, targetIds: [allyId] });
    const pass = legal({ move: "pass" });

    expect(
      compileGrandArchiveLine(snapshot(), [championAttack, allyAttack], {
        hint: { preferredTarget: { id: allyId } },
      })?.command,
    ).toBe(allyAttack);
    expect(
      compileGrandArchiveLine(snapshot(), [championAttack, pass], {
        adjustScore: (line) => (line.kind === "pass" ? 2_000 : 0),
      })?.command,
    ).toBe(pass);
    expect(() =>
      compileGrandArchiveLine(snapshot(), [pass], { adjustScore: () => Number.NaN }),
    ).toThrow(/must be finite/);

    const spendsProtected = legal({
      move: "activate-ability",
      sourceId: attackerId,
      abilityId: "profile-a1",
      reservePayment: [{ kind: "card", cardId: protectedPaymentId }],
    });
    const spendsExpendable = legal({
      move: "activate-ability",
      sourceId: attackerId,
      abilityId: "profile-a1",
      reservePayment: [{ kind: "card", cardId: expendablePaymentId }],
    });
    expect(
      compileGrandArchiveLine(snapshot(), [spendsProtected, spendsExpendable], {
        hint: { preserveFromReservePaymentIds: [protectedPaymentId] },
      })?.command,
    ).toBe(spendsExpendable);
  });

  it("retains ability, mode, and bound target declarations for profile ranking", () => {
    const firstAbility = legal({
      move: "activate-ability",
      sourceId: attackerId,
      abilityId: "first-ability",
      modeIds: ["draw"],
      targets: { recipient: [p2], activation: [stackItemId] },
    });
    const secondAbility = legal({
      move: "activate-ability",
      sourceId: attackerId,
      abilityId: "second-ability",
      modeIds: ["damage"],
      targets: { recipient: [championId] },
    });

    const preferredAbility = compileGrandArchiveLine(snapshot(), [firstAbility, secondAbility], {
      hint: { preferredAbilityId: "second-ability" },
    });
    expect(preferredAbility?.command).toBe(secondAbility);
    expect(preferredAbility).toMatchObject({
      abilityId: "second-ability",
      modeIds: ["damage"],
      targets: { recipient: [championId] },
      targetIds: [championId],
    });

    const preferredBoundTarget = compileGrandArchiveLine(
      snapshot(),
      [secondAbility, firstAbility],
      { hint: { preferredTarget: { id: stackItemId, binding: "activation" } } },
    );
    expect(preferredBoundTarget?.command).toBe(firstAbility);
    expect(preferredBoundTarget?.targetIds).toEqual([p2, stackItemId]);

    expect(
      compileGrandArchiveLine(snapshot(), [firstAbility, secondAbility], {
        hint: { preferredModeId: "damage" },
      })?.command,
    ).toBe(secondAbility);
  });

  it("retains and ranks complete Grand Archive attack compositions", () => {
    const firstWeaponAttack = legal({
      move: "declare-attack",
      attackerId,
      targetIds: [championId],
      attackCardId,
      weaponIds: [firstWeaponId],
    });
    const secondWeaponAttack = legal({
      move: "declare-attack",
      attackerId,
      targetIds: [championId],
      attackCardId,
      weaponIds: [secondWeaponId],
    });
    const delegatedAttack = legal({
      move: "declare-attack",
      attackerId,
      targetIds: [],
      delegatePlayerId: p2,
    });
    const cleaveAttack = legal({
      move: "declare-attack",
      attackerId,
      targetIds: [],
      cleavePlayerId: p2,
    });

    const preferredWeapon = compileGrandArchiveLine(
      snapshot(),
      [firstWeaponAttack, secondWeaponAttack],
      { hint: { preferredAttack: { attackCardId, weaponId: secondWeaponId } } },
    );
    expect(preferredWeapon?.command).toBe(secondWeaponAttack);
    expect(preferredWeapon).toMatchObject({
      attackCardId,
      weaponIds: [secondWeaponId],
      delegatePlayerId: null,
      cleavePlayerId: null,
    });
    expect(
      compileGrandArchiveLine(snapshot(), [cleaveAttack, delegatedAttack], {
        hint: { preferredAttack: { delegatePlayerId: p2 } },
      })?.command,
    ).toBe(delegatedAttack);
    expect(
      compileGrandArchiveLine(snapshot(), [delegatedAttack, cleaveAttack], {
        hint: { preferredAttack: { cleavePlayerId: p2 } },
      })?.command,
    ).toBe(cleaveAttack);
  });
});
