import type {
  FabCardDefinitionInput,
  FabPracticeMatch,
} from "@tcg/flesh-and-blood-engine/simulator";
import { nullruneRobe } from "@tcg/flesh-and-blood-cards/cards/equipment/nullrune-robe";
import { blazeFiremind } from "@tcg/flesh-and-blood-cards/cards/heroes/blaze-firemind";
import { oscilio } from "@tcg/flesh-and-blood-cards/cards/heroes/oscilio";
import { volticBoltRed } from "@tcg/flesh-and-blood-cards/cards/actions/voltic-bolt";
import {
  alphaRampageRed,
  blizzardBlue,
  bonebreakerBellowRed,
  braveforgeBracers,
  catalogIds,
  dawnblade,
  entwineIceRed,
  hadronColliderRed,
  holoShieldRed,
  indefensiblyHonedBlue,
  leaveNoWitnessesRed,
  plunderThePoorRed,
  silverstrideDodgers,
  snatchRed,
  spearsOfSurrealityRed,
  theSuspenseIsKillingMeBlue,
  wageMightBlue,
  zeroToSixtyRed,
  POISON_THE_WELL_BLUE_ID,
  FLASH_BOLT_RED_ID,
  DASH_ID,
  realCardDefinition,
  toFabCardDefinition,
} from "./cards";
import { matchFromEngine, createEngine, playAttackToDefendStep } from "./runtime";
import type { FabScenarioCollection } from "./types";

export const FAB_KEYWORD_ANIMATION_FIXTURE_IDS = {
  wager: wageMightBlue.canonicalId,
  boost: zeroToSixtyRed.canonicalId,
  boostTopMechanologist: hadronColliderRed.canonicalId,
  boostTopMiss: snatchRed.canonicalId,
  fusion: entwineIceRed.canonicalId,
  fusionReveal: blizzardBlue.canonicalId,
  phantasm: spearsOfSurrealityRed.canonicalId,
  phantasmBreaker: alphaRampageRed.canonicalId,
  phantasmBoundary: snatchRed.canonicalId,
  ward: holoShieldRed.canonicalId,
  contractComplete: leaveNoWitnessesRed.canonicalId,
  contractIncomplete: plunderThePoorRed.canonicalId,
  beatChest: bonebreakerBellowRed.canonicalId,
  beatChestDiscard: alphaRampageRed.canonicalId,
  crank: hadronColliderRed.canonicalId,
  battleworn: braveforgeBracers.canonicalId,
  temper: silverstrideDodgers.canonicalId,
  sword: dawnblade.canonicalId,
  suspense: theSuspenseIsKillingMeBlue.canonicalId,
  sharpen: indefensiblyHonedBlue.canonicalId,
} as const;

function revealLabAttackDefinition(): FabCardDefinitionInput {
  return {
    canonicalId: "fixture-animation-reveal-attack",
    name: "Reveal Lab Attack",
    types: ["Generic", "Action", "Attack"],
    pitch: 1,
    cost: 0,
    power: 3,
    defense: 2,
    abilities: [
      {
        id: "fixture-animation-reveal-cost",
        kind: "static",
        staticKind: "play",
        text: "As an additional cost to play this, reveal a card in your hand with cost 1 or less.",
        playEffect: {
          role: "additional-cost",
          cost: {
            class: "effect",
            type: "reveal",
            from: "hand",
            filter: { cost: { op: "lte", value: 1 } },
          },
        },
      },
    ],
  };
}

function shuffleLabHeadDefinition(): FabCardDefinitionInput {
  return {
    canonicalId: "fixture-animation-shuffle-head",
    name: "Shuffle Lab Hood",
    types: ["Generic", "Equipment", "Head"],
    defense: 1,
    abilities: [
      {
        id: "fixture-animation-shuffle-ability",
        kind: "activated",
        abilityType: "action",
        text: "Action — Shuffle this into its owner's deck: Gain 1 action point.",
        cost: {
          class: "effect",
          type: "move-to-deck",
          from: "self",
          position: "shuffle",
          count: 1,
        },
        effect: { type: "gain-action-points", amount: 1 },
      },
    ],
  };
}

function clashSequenceLabInstantDefinition(): FabCardDefinitionInput {
  return {
    canonicalId: "fixture-clash-sequence-lab",
    name: "Clash Sequence Lab",
    types: ["Generic", "Instant"],
    pitch: 1,
    cost: 0,
    abilities: [
      {
        id: "fixture-clash-sequence-lab-a1",
        kind: "resolution",
        text: "Clash with an opponent. The winner creates a Might token. Put your revealed card into your graveyard.",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "clash",
              with: { selector: "opponent" },
              prize: { type: "create-token", token: "might", controller: "winner" },
            },
            {
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["deck"],
                position: "top",
                count: 1,
              },
              to: { zone: "graveyard" },
            },
          ],
        },
      },
    ],
  };
}

function crowdReactionLabActionDefinition(reaction: "cheers" | "boos"): FabCardDefinitionInput {
  const cheers = reaction === "cheers";
  return {
    canonicalId: cheers ? "KMChcRLgKq8tLHQwffNpP" : "9PrjWmJjJtqFLctkQ7wLC",
    name: cheers ? "Heroic Pose (Blue)" : "Villainous Pose (Red)",
    types: [cheers ? "Revered" : "Reviled", "Action"],
    pitch: cheers ? 3 : 1,
    cost: cheers ? 1 : 2,
    defense: 2,
    keywords: [{ name: "go-again" }],
    abilities: [
      {
        id: cheers ? "fixture-heroic-pose-crowd" : "fixture-villainous-pose-crowd",
        kind: "resolution",
        text: cheers ? "The crowd cheers you." : "The crowd boos you.",
        effect: {
          type: cheers ? "crowd-cheers" : "crowd-boos",
          target: "controller",
        },
      },
    ],
  };
}

function bootPoisonSigilDamage(): FabPracticeMatch {
  const poisonTheWell = realCardDefinition(POISON_THE_WELL_BLUE_ID);
  const sigilOfSolace = realCardDefinition(catalogIds.sigilSolace);
  const flashBolt = realCardDefinition(FLASH_BOLT_RED_ID);
  const dash = realCardDefinition(DASH_ID);
  const engine = createEngine({
    seed: "fab-scenario-poison-sigil-damage",
    cardDefinitions: {
      [poisonTheWell.canonicalId]: poisonTheWell,
      [sigilOfSolace.canonicalId]: sigilOfSolace,
      [flashBolt.canonicalId]: flashBolt,
      [dash.canonicalId]: dash,
    },
    player1: {
      heroCardId: catalogIds.oscilio,
      life: 18,
      hand: [sigilOfSolace.canonicalId, flashBolt.canonicalId],
      deck: 8,
      actionPoints: 1,
      resourcePoints: 2,
    },
    player2: {
      heroCardId: dash.canonicalId,
      life: 20,
      hand: [poisonTheWell.canonicalId],
      deck: 8,
    },
  });
  const Oscilio = engine.as(catalogIds.oscilio);
  const Dash = engine.as(dash.canonicalId);
  Oscilio.pass();
  Dash.play(poisonTheWell.canonicalId);
  Dash.pass();
  return matchFromEngine(engine, "fab-scenario-poison-sigil-damage");
}

function bootRevealAndShuffle(): FabPracticeMatch {
  const revealAttack = revealLabAttackDefinition();
  const shuffleHead = shuffleLabHeadDefinition();
  const engine = createEngine({
    seed: "fab-scenario-reveal-and-shuffle",
    cardDefinitions: {
      [revealAttack.canonicalId]: revealAttack,
      [shuffleHead.canonicalId]: shuffleHead,
    },
    player1: {
      heroCardId: catalogIds.rhinar,
      life: 20,
      hand: [revealAttack.canonicalId, catalogIds.nimblismBlue],
      head: [shuffleHead.canonicalId],
      deck: 8,
      actionPoints: 1,
    },
    player2: {
      heroCardId: catalogIds.bravo,
      life: 20,
      hand: [],
      deck: 8,
    },
  });
  return matchFromEngine(engine, "fab-scenario-reveal-and-shuffle");
}

function bootDamagePrevention(): FabPracticeMatch {
  const engine = createEngine({
    seed: "fab-scenario-damage-prevention",
    cardDefinitions: {
      [blazeFiremind.canonicalId]: toFabCardDefinition(blazeFiremind),
      [oscilio.canonicalId]: toFabCardDefinition(oscilio),
      [volticBoltRed.canonicalId]: toFabCardDefinition(volticBoltRed),
      [nullruneRobe.canonicalId]: toFabCardDefinition(nullruneRobe),
    },
    player1: {
      heroCardId: blazeFiremind.canonicalId,
      life: 20,
      hand: [volticBoltRed.canonicalId],
      deck: 8,
      actionPoints: 1,
      resourcePoints: 2,
    },
    player2: {
      heroCardId: oscilio.canonicalId,
      life: 20,
      chest: [nullruneRobe.canonicalId],
      hand: [],
      deck: 8,
      resourcePoints: 1,
    },
  });
  const Blaze = engine.as(blazeFiremind);
  const Oscilio = engine.as(oscilio);
  Blaze.play(volticBoltRed, { target: Oscilio.id });
  engine.passBoth();
  return matchFromEngine(engine, "fab-scenario-damage-prevention");
}

function bootClashSequenceLab(): FabPracticeMatch {
  const clashLab = clashSequenceLabInstantDefinition();
  const engine = createEngine({
    seed: "fab-scenario-clash-sequence-lab",
    cardDefinitions: { [clashLab.canonicalId]: clashLab },
    player1: {
      heroCardId: catalogIds.rhinar,
      life: 20,
      hand: [clashLab.canonicalId, clashLab.canonicalId, clashLab.canonicalId],
      // bottom → top: draw (4), loss (no power), win (7)
      deck: [catalogIds.snatch, catalogIds.nimblismBlue, catalogIds.alphaRampage],
      actionPoints: 1,
    },
    player2: {
      heroCardId: catalogIds.bravo,
      life: 20,
      hand: [],
      // Fixed 4-power reveal for all three clashes.
      deck: [catalogIds.snatch],
    },
  });
  return matchFromEngine(engine, "fab-scenario-clash-sequence-lab");
}

function bootCrowdReactionLab(): FabPracticeMatch {
  const heroicPose = crowdReactionLabActionDefinition("cheers");
  const villainousPose = crowdReactionLabActionDefinition("boos");
  const engine = createEngine({
    seed: "fab-scenario-crowd-reaction-lab",
    cardDefinitions: {
      [heroicPose.canonicalId]: heroicPose,
      [villainousPose.canonicalId]: villainousPose,
    },
    player1: {
      heroCardId: catalogIds.rhinar,
      life: 20,
      hand: [heroicPose.canonicalId, villainousPose.canonicalId],
      deck: 8,
      actionPoints: 1,
      resourcePoints: 3,
    },
    player2: {
      heroCardId: catalogIds.bravo,
      life: 20,
      hand: [],
      deck: 8,
    },
  });
  return matchFromEngine(engine, "fab-scenario-crowd-reaction-lab");
}

function bootWagerOutcomeLab(): FabPracticeMatch {
  const wager = realCardDefinition(FAB_KEYWORD_ANIMATION_FIXTURE_IDS.wager);
  const alphaRampage = realCardDefinition(FAB_KEYWORD_ANIMATION_FIXTURE_IDS.phantasmBreaker);
  const snatch = realCardDefinition(FAB_KEYWORD_ANIMATION_FIXTURE_IDS.phantasmBoundary);
  const engine = createEngine({
    seed: "fab-scenario-wager-outcome-lab",
    cardDefinitions: {
      [wager.canonicalId]: wager,
      [alphaRampage.canonicalId]: alphaRampage,
      [snatch.canonicalId]: snatch,
    },
    player1: {
      heroCardId: catalogIds.rhinar,
      life: 20,
      hand: [wager.canonicalId, wager.canonicalId],
      deck: 8,
      actionPoints: 2,
      resourcePoints: 6,
    },
    player2: {
      heroCardId: catalogIds.bravo,
      life: 20,
      hand: [alphaRampage.canonicalId, snatch.canonicalId],
      deck: 8,
    },
  });
  return matchFromEngine(engine, "fab-scenario-wager-outcome-lab");
}

function bootBoostFusionLab(): FabPracticeMatch {
  const ids = FAB_KEYWORD_ANIMATION_FIXTURE_IDS;
  const cardDefinitions = Object.fromEntries(
    [ids.boost, ids.boostTopMechanologist, ids.boostTopMiss, ids.fusion, ids.fusionReveal].map(
      (id) => [id, realCardDefinition(id)],
    ),
  );
  const engine = createEngine({
    seed: "fab-scenario-boost-fusion-lab",
    cardDefinitions,
    player1: {
      heroCardId: catalogIds.rhinar,
      life: 20,
      hand: [ids.boost, ids.boost, ids.fusion, ids.fusionReveal],
      deck: [ids.boostTopMiss, ids.boostTopMechanologist],
      actionPoints: 3,
      resourcePoints: 3,
    },
    player2: {
      heroCardId: catalogIds.bravo,
      life: 20,
      hand: [],
      deck: 8,
    },
  });
  return matchFromEngine(engine, "fab-scenario-boost-fusion-lab");
}

function bootPhantasmWardLab(): FabPracticeMatch {
  const ids = FAB_KEYWORD_ANIMATION_FIXTURE_IDS;
  const cardDefinitions = Object.fromEntries(
    [ids.phantasm, ids.phantasmBreaker, ids.phantasmBoundary, ids.ward, ids.boost].map((id) => [
      id,
      realCardDefinition(id),
    ]),
  );
  const engine = createEngine({
    seed: "fab-scenario-phantasm-ward-lab",
    cardDefinitions,
    player1: {
      heroCardId: catalogIds.rhinar,
      life: 20,
      hand: [ids.boost, ids.phantasm, ids.phantasm],
      deck: 8,
      actionPoints: 3,
      resourcePoints: 3,
    },
    player2: {
      heroCardId: catalogIds.bravo,
      life: 20,
      hand: [ids.phantasmBreaker, ids.phantasmBoundary],
      arena: [ids.ward],
      deck: 8,
    },
  });
  return matchFromEngine(engine, "fab-scenario-phantasm-ward-lab");
}

function bootContractCompletionLab(): FabPracticeMatch {
  const ids = FAB_KEYWORD_ANIMATION_FIXTURE_IDS;
  const cardDefinitions = Object.fromEntries(
    [ids.contractComplete, ids.contractIncomplete, ids.boostTopMiss, ids.phantasmBreaker].map(
      (id) => [id, realCardDefinition(id)],
    ),
  );
  const engine = createEngine({
    seed: "fab-scenario-contract-completion-lab",
    cardDefinitions,
    player1: {
      heroCardId: catalogIds.rhinar,
      life: 20,
      hand: [ids.contractComplete, ids.contractIncomplete],
      deck: 8,
      actionPoints: 2,
    },
    player2: {
      heroCardId: catalogIds.bravo,
      life: 20,
      hand: [],
      deck: [ids.boostTopMiss, ids.phantasmBreaker],
    },
  });
  return matchFromEngine(engine, "fab-scenario-contract-completion-lab");
}

function bootAdditionalCostKeywordLab(): FabPracticeMatch {
  const ids = FAB_KEYWORD_ANIMATION_FIXTURE_IDS;
  const cardDefinitions = Object.fromEntries(
    [ids.beatChest, ids.beatChestDiscard, ids.crank].map((id) => [id, realCardDefinition(id)]),
  );
  const engine = createEngine({
    seed: "fab-scenario-additional-cost-keyword-lab",
    cardDefinitions,
    player1: {
      heroCardId: catalogIds.bravo,
      life: 20,
      hand: [ids.beatChest, ids.beatChestDiscard, ids.crank],
      deck: 8,
      actionPoints: 2,
      resourcePoints: 3,
    },
    player2: {
      heroCardId: catalogIds.bravo,
      life: 20,
      hand: [],
      deck: 8,
    },
  });
  return matchFromEngine(engine, "fab-scenario-additional-cost-keyword-lab");
}

function bootKeywordCounterLab(): FabPracticeMatch {
  const ids = FAB_KEYWORD_ANIMATION_FIXTURE_IDS;
  const cardDefinitions = Object.fromEntries(
    [ids.boostTopMiss, ids.battleworn, ids.temper, ids.sword, ids.suspense, ids.sharpen].map(
      (id) => [id, realCardDefinition(id)],
    ),
  );
  const engine = createEngine({
    seed: "fab-scenario-keyword-counter-lab",
    firstPlayerId: "player-2",
    cardDefinitions,
    player1: {
      heroCardId: catalogIds.rhinar,
      life: 20,
      legs: [ids.temper],
      arms: [ids.battleworn],
      weapon1: [ids.sword],
      hand: [ids.suspense, ids.sharpen],
      deck: 8,
      actionPoints: 1,
      resourcePoints: 3,
    },
    player2: {
      heroCardId: catalogIds.bravo,
      life: 20,
      hand: [ids.boostTopMiss],
      deck: 8,
      actionPoints: 1,
    },
  });
  playAttackToDefendStep(engine, catalogIds.bravo, ids.boostTopMiss, catalogIds.rhinar);
  return matchFromEngine(engine, "fab-scenario-keyword-counter-lab");
}

export const ANIMATIONS_SCENARIOS = {
  "poison-sigil-damage": {
    id: "poison-sigil-damage",
    label: "Life change · Poison, Sigil, and Flash Bolt",
    description:
      "Poison the Well is on the opponent's stack. Pass to resolve it, play Sigil of Solace to turn +3 life into -3 life, then target either hero with Flash Bolt for 3 arcane damage.",
    group: "opening",
    tags: ["engine", "life", "damage", "replacement", "instant", "sound"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot: bootPoisonSigilDamage,
  },
  "reveal-and-shuffle": {
    id: "reveal-and-shuffle",
    label: "Reveal and shuffle animation lab",
    description:
      "Play Reveal Lab Attack and reveal Nimblism as its additional cost, or activate Shuffle Lab Hood to move it into and randomize the deck.",
    group: "opening",
    tags: ["engine", "animation", "reveal", "shuffle", "sound"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot: bootRevealAndShuffle,
  },
  "clash-sequence-lab": {
    id: "clash-sequence-lab",
    label: "Clash · win, lose, draw",
    description:
      "Play the three Clash Sequence Lab Instants in order: P1 reveals 9 vs 4 and wins, then a card without power vs 4 and loses, then 4 vs 4 for no winner. Each lab card mills P1's reveal so the prepared next card becomes the deck top.",
    group: "opening",
    tags: ["engine", "clash", "reveal", "deck-order", "win", "lose", "draw"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot: bootClashSequenceLab,
  },
  "crowd-reaction-lab": {
    id: "crowd-reaction-lab",
    label: "Crowd · cheers and boos",
    description:
      "Play Heroic Pose to make the crowd cheer Rhinar, then Villainous Pose to make the crowd boo him. Both reactions stay anchored to the affected hero while the board remains readable.",
    group: "opening",
    tags: ["engine", "animation", "crowd", "cheers", "boos", "hero"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot: bootCrowdReactionLab,
  },
  "wager-outcome-lab": {
    id: "wager-outcome-lab",
    label: "Wager · hit and miss",
    description:
      "Attack twice with Wage Might (Blue). Let the first hit, then block the second with Alpha Rampage and Snatch to produce both real Wager outcomes.",
    group: "opening",
    tags: ["engine", "animation", "wager", "combat", "hit", "miss"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot: bootWagerOutcomeLab,
  },
  "boost-fusion-lab": {
    id: "boost-fusion-lab",
    label: "Boost and Fusion · outcomes",
    description:
      "Boost two copies of Zero to Sixty: Hadron Collider succeeds and Snatch misses. Then fuse Entwine Ice by revealing Blizzard.",
    group: "opening",
    tags: ["engine", "animation", "boost", "fusion", "reveal", "banish"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot: bootBoostFusionLab,
  },
  "phantasm-ward-lab": {
    id: "phantasm-ward-lab",
    label: "Phantasm and Ward · resolution",
    description:
      "Resolve Zero to Sixty into Holo Shield's Ward 1, then block Spears of Surreality with Alpha Rampage and Snatch to compare Phantasm destruction and survival.",
    group: "opening",
    tags: ["engine", "animation", "phantasm", "ward", "prevent", "destroy"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot: bootPhantasmWardLab,
  },
  "contract-completion-lab": {
    id: "contract-completion-lab",
    label: "Contract · complete and incomplete",
    description:
      "Hit first with Plunder the Poor while Alpha Rampage is on top (incomplete), then with Leave No Witnesses while Snatch is on top (complete).",
    group: "opening",
    tags: ["engine", "animation", "contract", "complete", "boundary"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot: bootContractCompletionLab,
  },
  "additional-cost-keyword-lab": {
    id: "additional-cost-keyword-lab",
    label: "Beat Chest and Crank · paid costs",
    description:
      "Play Bonebreaker Bellow with Beat Chest by discarding Alpha Rampage, then play Hadron Collider and choose Crank.",
    group: "opening",
    tags: ["engine", "animation", "beat-chest", "crank", "discard", "counter"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot: bootAdditionalCostKeywordLab,
  },
  "keyword-counter-lab": {
    id: "keyword-counter-lab",
    label: "Keyword counters · equipment and permanents",
    description:
      "Defend with Braveforge Bracers and Silverstride Dodgers. Then play The Suspense Is Killing Me and Indefensibly Honed targeting Dawnblade.",
    group: "opening",
    tags: ["engine", "animation", "battleworn", "temper", "suspense", "sharpen"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot: bootKeywordCounterLab,
  },
  "damage-prevention": {
    id: "damage-prevention",
    label: "Arcane Barrier · defending player",
    description:
      "You are defending as Oscilio against Voltic Bolt for 5 arcane damage. Choose whether to pay 1 resource for Nullrune Robe's Arcane Barrier 1.",
    group: "opening",
    tags: ["engine", "arcane", "damage", "prevention", "arcane-barrier", "defender"],
    viewerId: "player-2",
    botMode: "pass-only",
    boot: bootDamagePrevention,
  },
} satisfies FabScenarioCollection;
