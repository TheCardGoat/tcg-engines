import type { FabPracticeMatch } from "@tcg/flesh-and-blood-engine/simulator";
import { cintariSellsword } from "@tcg/flesh-and-blood-cards/cards/tokens/cintari-sellsword";
import { holdEmRed } from "@tcg/flesh-and-blood-cards/cards/actions/hold-em";
import { intoTheMuckRed } from "@tcg/flesh-and-blood-cards/cards/attack-reactions/into-the-muck";
import { kassai } from "@tcg/flesh-and-blood-cards/cards/heroes/kassai";
import type { FabPresentationState } from "../state";
import {
  catalogIds,
  cintariSaber,
  dash,
  headJabBlue,
  sigilOfSolaceRed,
  digInYellow,
  tuffnut,
  toughness,
  nimblismBlue,
  nimblismYellow,
  noHeroStandsAloneYellow,
  realCardDefinition,
  toFabCardDefinition,
} from "./cards";
import { matchFromEngine, createEngine, playAttackToDefendStep, rhinarBravoBase } from "./runtime";
import { withActiveEffectsLab } from "./presentation";
import type { FabScenarioCollection } from "./types";

function bootDefendOpen(): FabPracticeMatch {
  const engine = createEngine(
    rhinarBravoBase("fab-scenario-defend-open", {
      player1: {
        hand: [catalogIds.snatch, catalogIds.nimblismBlue, catalogIds.wreckerRomp],
        actionPoints: 1,
      },
      player2: {
        hand: [catalogIds.sinkBelow, catalogIds.enlightenedStrike, catalogIds.unmovable],
      },
    }),
  );
  playAttackToDefendStep(engine, catalogIds.rhinar, catalogIds.snatch, catalogIds.bravo);
  // Defender (p2) must act while rules priority is closed; the p2 viewer can block or pass.
  return matchFromEngine(engine, "fab-scenario-defend-open");
}

function bootDefenderZoneExit(): FabPracticeMatch {
  const seed = "fab-scenario-defender-zone-exit";
  const scenarioCards = [
    kassai,
    cintariSaber,
    holdEmRed,
    intoTheMuckRed,
    dash,
    nimblismBlue,
  ] as const;
  const engine = createEngine({
    seed,
    cardDefinitions: Object.fromEntries(
      scenarioCards.map((card) => [card.canonicalId, toFabCardDefinition(card)]),
    ),
    player1: {
      heroCardId: kassai.canonicalId,
      weapon1: [cintariSaber.canonicalId],
      hand: [holdEmRed.canonicalId, intoTheMuckRed.canonicalId],
      resourcePoints: 3,
      actionPoints: 1,
      deck: 6,
    },
    player2: {
      heroCardId: dash.canonicalId,
      hand: [nimblismBlue.canonicalId],
      life: 20,
      deck: 6,
    },
  });
  const Kassai = engine.as(kassai);
  const Dash = engine.as(dash);

  Kassai.play(holdEmRed);
  engine.untilIdle({ optionals: "decline", ordering: "listed" });
  Kassai.activateAttack(cintariSaber, { stopAt: "on-attack" });
  Kassai.accept();
  engine.advanceUntil({ stopAt: "defend" });
  Dash.defendWith(nimblismBlue);
  engine.toReaction("attacker");

  return matchFromEngine(engine, seed);
}

function bootAllyAttackTarget(): FabPracticeMatch {
  const seed = "fab-scenario-ally-attack-target";
  const engine = createEngine({
    ...rhinarBravoBase(seed, {
      player1: { hand: [catalogIds.snatch], actionPoints: 1 },
      player2: { arena: [cintariSellsword.canonicalId] },
    }),
    cardDefinitions: {
      [cintariSellsword.canonicalId]: toFabCardDefinition(cintariSellsword),
    },
  });
  const defender = engine.as(catalogIds.bravo);
  const ally = defender.findCardInZone("arena", cintariSellsword.canonicalId);
  engine.as(catalogIds.rhinar).attackWith(catalogIds.snatch, { target: ally });
  return matchFromEngine(engine, seed);
}

function bootAllyAttackTargetChoice(): FabPracticeMatch {
  const seed = "fab-scenario-ally-attack-target-choice";
  const engine = createEngine({
    ...rhinarBravoBase(seed, {
      player1: { hand: [catalogIds.snatch], actionPoints: 1 },
      player2: { arena: [cintariSellsword.canonicalId] },
    }),
    cardDefinitions: {
      [cintariSellsword.canonicalId]: toFabCardDefinition(cintariSellsword),
    },
  });
  return matchFromEngine(engine, seed);
}

function bootAttackOnlyHeadJab(): FabPracticeMatch {
  const engine = createEngine({
    seed: "fab-scenario-attack-only-head-jab",
    firstPlayerId: "player-2",
    cardDefinitions: {
      [headJabBlue.canonicalId]: toFabCardDefinition(headJabBlue),
    },
    player1: {
      heroCardId: catalogIds.rhinar,
      life: 20,
      weapon1: [catalogIds.rompingClub],
      hand: [
        catalogIds.sinkBelow,
        catalogIds.enlightenedStrike,
        catalogIds.snatch,
        catalogIds.nimblismBlue,
        catalogIds.unmovable,
        catalogIds.crackedBauble,
      ],
      deck: 12,
      resourcePoints: 3,
    },
    player2: {
      heroCardId: catalogIds.bravo,
      life: 20,
      weapon1: [catalogIds.anothos],
      hand: [
        headJabBlue.canonicalId,
        headJabBlue.canonicalId,
        headJabBlue.canonicalId,
        headJabBlue.canonicalId,
      ],
      deck: 12,
      actionPoints: 1,
    },
  });
  return matchFromEngine(engine, "fab-scenario-attack-only-head-jab");
}

function bootDefendDeclared(): FabPracticeMatch {
  const engine = createEngine(
    rhinarBravoBase("fab-scenario-defend-declared", {
      player1: {
        hand: [
          catalogIds.alphaRampage,
          catalogIds.nimblismBlue,
          catalogIds.nimblismBlue,
          catalogIds.nimblismBlue,
        ],
        actionPoints: 1,
      },
      player2: {
        hand: [
          catalogIds.sinkBelow,
          catalogIds.enlightenedStrike,
          catalogIds.enlightenedStrike,
          catalogIds.crackedBauble,
          catalogIds.snatch,
          catalogIds.snatch,
        ],
      },
    }),
  );
  playAttackToDefendStep(engine, catalogIds.rhinar, catalogIds.alphaRampage, catalogIds.bravo, [
    catalogIds.nimblismBlue,
    catalogIds.nimblismBlue,
    catalogIds.nimblismBlue,
  ]);
  // Sink Below is a defense reaction, so preserve the declared-block visual
  // with ordinary hand defenders in the Defend step.
  engine.defend("player-2", [catalogIds.enlightenedStrike, catalogIds.snatch]);
  // After declare blocks, priority typically returns for reactions — leave as-is.
  return matchFromEngine(engine, "fab-scenario-defend-declared");
}

function bootDigInDefense(): FabPracticeMatch {
  const engine = createEngine({
    seed: "fab-scenario-dig-in-defense",
    cardDefinitions: {
      [digInYellow.canonicalId]: toFabCardDefinition(digInYellow),
      [nimblismYellow.canonicalId]: toFabCardDefinition(nimblismYellow),
      [tuffnut.canonicalId]: toFabCardDefinition(tuffnut),
    },
    player1: {
      heroCardId: dash.canonicalId,
      life: 20,
      hand: [catalogIds.snatch],
      deck: 8,
      actionPoints: 1,
    },
    player2: {
      heroCardId: tuffnut.canonicalId,
      life: 20,
      hand: [digInYellow.canonicalId, nimblismYellow.canonicalId, catalogIds.nimblismBlue],
      deck: 8,
      resourcePoints: 0,
    },
  });
  playAttackToDefendStep(engine, dash.canonicalId, catalogIds.snatch, tuffnut.canonicalId);
  return matchFromEngine(engine, "fab-scenario-dig-in-defense");
}

function bootNoHeroStandsAloneDefenseTarget(): FabPracticeMatch {
  const cardIds = [
    dash.canonicalId,
    tuffnut.canonicalId,
    toughness.canonicalId,
    noHeroStandsAloneYellow.canonicalId,
  ] as const;
  const engine = createEngine({
    seed: "fab-scenario-no-hero-stands-alone-defense-target",
    firstPlayerId: "player-2",
    cardDefinitions: Object.fromEntries(
      cardIds.map((canonicalId) => [canonicalId, realCardDefinition(canonicalId)]),
    ),
    player1: {
      heroCardId: dash.canonicalId,
      life: 20,
      hand: [catalogIds.snatch],
      deck: [catalogIds.nimblismBlue],
      actionPoints: 1,
    },
    player2: {
      heroCardId: tuffnut.canonicalId,
      life: 20,
      arena: [toughness.canonicalId],
      hand: [noHeroStandsAloneYellow.canonicalId],
      arsenal: [noHeroStandsAloneYellow.canonicalId],
      deck: [
        catalogIds.alphaRampage,
        catalogIds.nimblismBlue,
        catalogIds.nimblismBlue,
        catalogIds.nimblismBlue,
        catalogIds.nimblismBlue,
      ],
      actionPoints: 1,
    },
  });
  return matchFromEngine(engine, "fab-scenario-no-hero-stands-alone-defense-target");
}

function bootCombatStackResponses(
  layerCount = 4,
  fixtureId = "fab-scenario-combat-stack-responses",
): FabPracticeMatch {
  const engine = createEngine(
    rhinarBravoBase(fixtureId, {
      player1: {
        hand: [
          catalogIds.snatch,
          catalogIds.sigilSolace,
          catalogIds.sigilSolace,
          catalogIds.sigilSolace,
          catalogIds.sigilSolace,
          catalogIds.nimblismBlue,
        ],
        actionPoints: 1,
      },
      player2: {
        hand: [
          catalogIds.sigilSolace,
          catalogIds.sigilSolace,
          catalogIds.sigilSolace,
          catalogIds.sigilSolace,
          catalogIds.sinkBelow,
        ],
      },
    }),
  );
  playAttackToDefendStep(engine, catalogIds.rhinar, catalogIds.snatch, catalogIds.bravo);
  engine.defend("player-2", []);

  const firstResponderId = engine.getPriorityPlayerId();
  if (!firstResponderId) throw new Error("Expected priority during the Defend step.");
  const secondResponderId = firstResponderId === "player-1" ? "player-2" : "player-1";
  const heroForPlayer = (playerId: string) =>
    playerId === "player-1" ? catalogIds.rhinar : catalogIds.bravo;
  const firstResponder = engine.as(heroForPlayer(firstResponderId));
  const secondResponder = engine.as(heroForPlayer(secondResponderId));
  const responders = [firstResponder, secondResponder] as const;
  for (let index = 0; index < layerCount; index += 1) {
    responders[index % responders.length].play(catalogIds.sigilSolace);
    if (index < layerCount - 1) responders[index % responders.length].pass();
  }

  const stackLength = engine.getView({ role: "player", actorId: "player-1" }).rulesStack.length;
  if (engine.combat()?.step !== "defend" || stackLength !== layerCount) {
    throw new Error(
      `Expected ${layerCount} Sigil of Solace layers during the open Defend step; got ${engine.combat()?.step ?? "closed"} / ${stackLength}.`,
    );
  }
  return matchFromEngine(engine, fixtureId);
}

function bootResolutionStackPriority(): FabPracticeMatch {
  const fixtureId = "fab-scenario-resolution-stack-priority";
  const base = rhinarBravoBase(fixtureId, {
    player1: {
      hand: [headJabBlue.canonicalId, sigilOfSolaceRed.canonicalId],
      actionPoints: 1,
    },
    player2: { hand: [] },
  });
  const engine = createEngine({
    ...base,
    cardDefinitions: {
      ...base.cardDefinitions,
      [headJabBlue.canonicalId]: toFabCardDefinition(headJabBlue),
      [sigilOfSolaceRed.canonicalId]: toFabCardDefinition(sigilOfSolaceRed),
    },
  });

  playAttackToDefendStep(engine, catalogIds.rhinar, headJabBlue.canonicalId, catalogIds.bravo);
  engine.defend("player-2", []);
  engine.advanceUntil({ stopAt: "resolution", optionals: "decline", ordering: "listed" });
  engine.as(catalogIds.rhinar).play(sigilOfSolaceRed.canonicalId);

  const stackLength = engine.getView({ role: "player", actorId: "player-1" }).rulesStack.length;
  if (engine.combat()?.step !== "resolution" || stackLength !== 1) {
    throw new Error(
      `Expected one Sigil of Solace layer during Resolution; got ${engine.combat()?.step ?? "closed"} / ${stackLength}.`,
    );
  }
  return matchFromEngine(engine, fixtureId);
}

function bootDamageStep(): FabPracticeMatch {
  const engine = createEngine(
    rhinarBravoBase("fab-scenario-damage", {
      player1: {
        // Wrecker Romp discards a random card as an additional cost. Keep a
        // second Pummel so the reaction step always has its intended card.
        hand: [catalogIds.wreckerRomp, catalogIds.pummel, catalogIds.pummel],
        actionPoints: 1,
        resourcePoints: 5,
      },
      player2: {
        hand: [catalogIds.sinkBelow, catalogIds.crackedBauble, catalogIds.enlightenedStrike],
      },
    }),
  );
  playAttackToDefendStep(engine, catalogIds.rhinar, catalogIds.wreckerRomp, catalogIds.bravo);
  // Keep the declared-block step empty so Sink Below can be played during the
  // reaction step, where defense reactions are legal.
  engine.defend("player-2", []);
  engine.passBoth();
  if (engine.combat()?.step === "reaction") {
    engine.as(catalogIds.rhinar).play(catalogIds.pummel, {
      modeIds: [`${catalogIds.pummel}:chooseMode:hitHero`],
    });
    // Playing Pummel preserves attacker priority; explicitly pass it to Bravo
    // before playing the defense reaction.
    engine.as(catalogIds.rhinar).pass();
    engine.as(catalogIds.bravo).play(catalogIds.sinkBelow);
    engine.passBoth();
    // Sink Below's optional deck-bottom choice is deliberately declined so
    // this visual fixture stops at damage without a hidden player prompt.
    if (engine.getState().decision?.kind === "boolean") {
      engine.as(catalogIds.bravo).chooseBoolean(false);
    }
  }
  if (engine.combat()?.open && engine.combat()?.step !== "damage") engine.advanceCombatTo("damage");
  return matchFromEngine(engine, "fab-scenario-damage");
}

function bootMultiLinkHistory(): FabPracticeMatch {
  const engine = createEngine(
    rhinarBravoBase("fab-scenario-multi-link-history", {
      player1: {
        hand: [
          catalogIds.alphaRampage,
          catalogIds.snatch,
          catalogIds.wreckerRomp,
          catalogIds.nimblismBlue,
          catalogIds.nimblismBlue,
          catalogIds.nimblismBlue,
        ],
        actionPoints: 1,
      },
      player2: {
        hand: [
          catalogIds.sinkBelow,
          catalogIds.sinkBelow,
          catalogIds.enlightenedStrike,
          catalogIds.enlightenedStrike,
          catalogIds.snatch,
          catalogIds.snatch,
          catalogIds.nimblismBlue,
          catalogIds.nimblismBlue,
        ],
      },
    }),
  );
  playAttackToDefendStep(engine, catalogIds.rhinar, catalogIds.alphaRampage, catalogIds.bravo, [
    catalogIds.nimblismBlue,
    catalogIds.nimblismBlue,
    catalogIds.nimblismBlue,
  ]);
  engine.defend("player-2", [
    catalogIds.enlightenedStrike,
    catalogIds.snatch,
    catalogIds.nimblismBlue,
  ]);
  return matchFromEngine(engine, "fab-scenario-multi-link-history");
}

function withMultiLinkHistory(state: FabPresentationState): FabPresentationState {
  const activeLink = state.combat?.activeLink;
  if (!activeLink || !state.combat) return state;

  const instanceIdFor = (cardId: string) =>
    Object.values(state.cards).find((card) => card.cardId === cardId)?.id;
  const snatch = instanceIdFor(catalogIds.snatch);
  const wreckerRomp = instanceIdFor(catalogIds.wreckerRomp);
  if (!snatch || !wreckerRomp) return state;

  const historicalDefenders = activeLink.defendingInstanceIds;
  const firstLinkDefenders = historicalDefenders.slice(0, 1);
  const defenseFor = (instanceId: string) => {
    const card = state.cards[instanceId];
    return card ? (state.cardDefinitions[card.cardId]?.defense ?? 0) : 0;
  };
  const totalDefenseFor = (instanceIds: readonly string[]) =>
    instanceIds.reduce((total, instanceId) => total + defenseFor(instanceId), 0);
  const firstLinkDefense = totalDefenseFor(firstLinkDefenders);
  const secondLinkDefense = totalDefenseFor(historicalDefenders);

  return {
    ...state,
    combat: {
      ...state.combat,
      resolvedLinks: [
        {
          attackInstanceId: snatch,
          attackingPlayerId: activeLink.attackingPlayerId,
          defendingPlayerId: activeLink.defendingPlayerId,
          defendingInstanceIds: firstLinkDefenders,
          reactionInstanceIds: [],
          attackPower: 4,
          totalDefense: firstLinkDefense,
          damage: Math.max(0, 4 - firstLinkDefense),
          didHit: 4 > firstLinkDefense,
        },
        {
          attackInstanceId: wreckerRomp,
          attackingPlayerId: activeLink.attackingPlayerId,
          defendingPlayerId: activeLink.defendingPlayerId,
          defendingInstanceIds: historicalDefenders,
          reactionInstanceIds: [],
          attackPower: 6,
          totalDefense: secondLinkDefense,
          damage: 0,
          didHit: false,
        },
      ],
    },
  };
}

function bootMultiBlock(): FabPracticeMatch {
  const engine = createEngine(
    rhinarBravoBase("fab-scenario-multi-block", {
      player1: {
        hand: [
          catalogIds.alphaRampage,
          catalogIds.nimblismBlue,
          catalogIds.nimblismBlue,
          catalogIds.nimblismBlue,
        ],
        actionPoints: 1,
      },
      player2: {
        hand: [
          catalogIds.sinkBelow,
          catalogIds.enlightenedStrike,
          catalogIds.enlightenedStrike,
          catalogIds.snatch,
          catalogIds.snatch,
          catalogIds.wreckerRomp,
          catalogIds.wreckerRomp,
          catalogIds.nimblismBlue,
          catalogIds.nimblismBlue,
        ],
      },
    }),
  );
  playAttackToDefendStep(engine, catalogIds.rhinar, catalogIds.alphaRampage, catalogIds.bravo, [
    catalogIds.nimblismBlue,
    catalogIds.nimblismBlue,
    catalogIds.nimblismBlue,
  ]);
  engine.defend("player-2", [
    catalogIds.enlightenedStrike,
    catalogIds.snatch,
    catalogIds.wreckerRomp,
    catalogIds.nimblismBlue,
  ]);
  return matchFromEngine(engine, "fab-scenario-multi-block");
}

function bootBetweenLinksApprox(): FabPracticeMatch {
  // Best-effort: resolve a full combat chain with no go-again, then leave
  // action-phase state after combat (closed). True "between links" needs go again.
  const engine = createEngine(
    rhinarBravoBase("fab-scenario-between-links", {
      player1: {
        hand: [catalogIds.snatch, catalogIds.wreckerRomp, catalogIds.nimblismBlue],
        actionPoints: 1,
      },
      player2: {
        hand: [catalogIds.sinkBelow, catalogIds.snatch],
      },
    }),
  );
  playAttackToDefendStep(engine, catalogIds.rhinar, catalogIds.snatch, catalogIds.bravo);
  engine.defend("player-2", [catalogIds.snatch]);
  try {
    engine.resolveCombatNoReactions();
  } catch {
    // If combat already closed, fine.
  }
  return matchFromEngine(engine, "fab-scenario-between-links");
}

export const COMBAT_SCENARIOS = {
  "ally-attack-target-choice": {
    id: "ally-attack-target-choice",
    label: "Combat · choose ally target",
    description:
      "Snatch is ready to attack while the opposing hero and Cintari Sellsword are both legal targets.",
    group: "combat",
    tags: ["engine", "combat", "ally", "attack-target", "interaction"],
    viewerId: "player-1",
    botMode: "off",
    boot: bootAllyAttackTargetChoice,
  },
  "ally-attack-target": {
    id: "ally-attack-target",
    label: "Combat · ally target",
    description: "Snatch attacks Cintari Sellsword, keeping the ally visible as the combat target.",
    group: "combat",
    tags: ["engine", "combat", "ally", "attack-target"],
    viewerId: "player-2",
    botMode: "off",
    boot: bootAllyAttackTarget,
  },
  "attack-only-head-jab": {
    id: "attack-only-head-jab",
    label: "Opponent turn · Head Jab",
    description:
      "Opponent starts with an attack-only bot and four Head Jabs with go again; the defender has three ordinary defending cards plus two defense reactions.",
    group: "combat",
    tags: ["engine", "opponent-turn", "attack-only", "go-again", "head-jab", "defend"],
    viewerId: "player-1",
    botMode: "attack-only",
    boot: bootAttackOnlyHeadJab,
  },
  "defend-open": {
    id: "defend-open",
    label: "Defend step · open",
    description: "Attack resolved to Defend; you are the defender with blocks in hand.",
    group: "combat",
    tags: ["engine", "defend", "active-link"],
    viewerId: "player-2",
    botMode: "off",
    boot: bootDefendOpen,
  },
  "defend-open-attacker": {
    id: "defend-open-attacker",
    label: "Defend step · attacking view",
    description: "The same open defense declaration viewed by the waiting attacker.",
    group: "combat",
    tags: ["engine", "defend", "active-link", "opponent-agency"],
    viewerId: "player-1",
    botMode: "off",
    boot: bootDefendOpen,
  },
  "defender-zone-exit": {
    id: "defender-zone-exit",
    label: "Defender leaves chain · Into the Muck",
    description:
      "A wagered Cintari Saber attack is defended by Nimblism. Play Into the Muck and pass priority to verify the defender leaves the chain for the banished zone with visible movement.",
    group: "combat",
    tags: ["engine", "combat", "regression", "defender", "banish", "animation", "AOL007"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot: bootDefenderZoneExit,
  },
  "defend-declared": {
    id: "defend-declared",
    label: "Defend declared · multi-block",
    description: "Alpha Rampage into two declared blocks on the chain.",
    group: "combat",
    tags: ["engine", "defend", "multi-block", "active-link"],
    viewerId: "player-1",
    botMode: "off",
    boot: bootDefendDeclared,
  },
  "dig-in-defense": {
    id: "dig-in-defense",
    label: "Dig In · opponent attack",
    description:
      "Dash attacks with Snatch. From Tuffnut's seat, declare Dig In as a defender, then pitch Nimblism Yellow and Blue to pay 3 resources for Toughness tokens.",
    group: "combat",
    tags: ["engine", "defend", "dig-in", "toughness", "optional-payment"],
    viewerId: "player-2",
    botMode: "off",
    boot: bootDigInDefense,
  },
  "no-hero-stands-alone-defense-target": {
    id: "no-hero-stands-alone-defense-target",
    label: "No Hero Stands Alone · ambush from arsenal",
    description:
      "Start as Tuffnut with Toughness in the arena and No Hero Stands Alone in both hand and arsenal. End the turn; Toughness is destroyed at the start of Dash's turn, then compare either ambush defense against the bot's Snatch and resolve the Clash.",
    group: "combat",
    tags: [
      "engine",
      "SUP020",
      "toughness",
      "arsenal",
      "ambush",
      "opponent-turn",
      "defend",
      "clash",
      "target",
    ],
    viewerId: "player-2",
    botMode: "attack-only",
    boot: bootNoHeroStandsAloneDefenseTarget,
  },
  "active-effects-combat-lab": {
    id: "active-effects-combat-lab",
    label: "Active effects · combat",
    description:
      "Active chain link with both seats and the game under projected effects, proving the compact combat affordance and overlay.",
    group: "combat",
    tags: ["engine", "effects", "combat", "active-link", "overlay"],
    viewerId: "player-1",
    botMode: "off",
    boot: bootDefendDeclared,
    presentationTransform: withActiveEffectsLab,
  },
  "compact-stack-one": {
    id: "compact-stack-one",
    label: "Compact stack · one layer",
    description: "One Sigil layer at an open priority window; layer 1 resolves next.",
    group: "combat",
    tags: ["engine", "combat", "stack", "compact", "one-layer"],
    viewerId: "player-1",
    botMode: "off",
    boot: () => bootCombatStackResponses(1, "fab-scenario-compact-stack-one"),
  },
  "compact-stack-two": {
    id: "compact-stack-two",
    label: "Compact stack · two layers",
    description: "Two alternating Sigil layers at an open priority window; layer 1 resolves next.",
    group: "combat",
    tags: ["engine", "combat", "stack", "compact", "two-layers"],
    viewerId: "player-1",
    botMode: "off",
    boot: () => bootCombatStackResponses(2, "fab-scenario-compact-stack-two"),
  },
  "compact-stack-three": {
    id: "compact-stack-three",
    label: "Compact stack · three layers",
    description:
      "Three alternating Sigil layers at an open priority window; layer 1 resolves next.",
    group: "combat",
    tags: ["engine", "combat", "stack", "compact", "three-layers"],
    viewerId: "player-1",
    botMode: "off",
    boot: () => bootCombatStackResponses(3, "fab-scenario-compact-stack-three"),
  },
  "combat-stack-responses": {
    id: "combat-stack-responses",
    label: "Combat stack · four instant responses",
    description:
      "Open Defend step with alternating Sigil of Solace responses from both players; layer 1 resolves next.",
    group: "combat",
    tags: ["engine", "combat", "stack", "instant", "responses", "sigil-of-solace"],
    viewerId: "player-1",
    botMode: "off",
    boot: bootCombatStackResponses,
  },
  "resolution-stack-priority": {
    id: "resolution-stack-priority",
    label: "Resolution step · pending layer",
    description:
      "Head Jab has resolved with go again, then its controller plays Sigil of Solace. The pending layer must be handled before the combat chain can close.",
    group: "combat",
    tags: ["engine", "combat", "resolution", "stack", "instant", "prompt-priority"],
    viewerId: "player-1",
    botMode: "off",
    boot: bootResolutionStackPriority,
  },
  "damage-step": {
    id: "damage-step",
    label: "Damage step",
    description: "Blocked attack at Damage, retaining this link's played attack-reaction history.",
    group: "combat",
    tags: ["engine", "damage", "active-link"],
    viewerId: "player-1",
    botMode: "off",
    boot: bootDamageStep,
  },
  "multi-link-history": {
    id: "multi-link-history",
    label: "Multi-link combat history",
    description:
      "Two resolved links (one hit, one blocked) followed by an active Alpha Rampage link.",
    group: "combat",
    tags: ["engine", "combat", "multi-link", "history", "active-link"],
    viewerId: "player-1",
    botMode: "off",
    boot: bootMultiLinkHistory,
    presentationTransform: withMultiLinkHistory,
  },
  "multi-block": {
    id: "multi-block",
    label: "Heavy multi-block",
    description: "Crippling Crush into three defending cards.",
    group: "edge",
    tags: ["engine", "multi-block", "active-link"],
    viewerId: "player-1",
    botMode: "off",
    boot: bootMultiBlock,
  },
  "between-links": {
    id: "between-links",
    label: "After combat (chain closed)",
    description:
      "Full combat resolved with no go-again — action phase after chain close (between-links proxy).",
    group: "combat",
    tags: ["engine", "resolved", "closed"],
    viewerId: "player-1",
    botMode: "off",
    boot: bootBetweenLinksApprox,
  },
  combat: {
    id: "combat",
    label: "Combat · defend declared",
    description: "Alias of multi-block combat for legacy /tests/combat links.",
    group: "combat",
    tags: ["engine", "legacy-id", "active-link"],
    viewerId: "player-1",
    botMode: "off",
    boot: bootDefendDeclared,
  },
} satisfies FabScenarioCollection;
