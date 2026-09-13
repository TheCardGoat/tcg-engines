import type { FabPracticeMatch } from "@tcg/flesh-and-blood-engine/simulator";
import type { FabTestFixture } from "@tcg/flesh-and-blood-engine/testing";
import {
  arakni,
  benjiThePiercingWind,
  blessingOfThemisYellow,
  bravoShowstopper,
  censorRed,
  chainsOfEminenceRed,
  crouchingTiger,
  dash,
  embodyGreatnessYellow,
  emperorDracaiOfAesir,
  gustwaveOfTheSecondWindRed,
  headLeadsTheTailRed,
  hunterOrHuntedBlue,
  imperialEdictRed,
  katsu,
  leaveEmSpeechlessBlue,
  maskOfManyFaces,
  nimblismBlue,
  nullTimeZoneBlue,
  phantasmalSymbiosisYellow,
  pickACardAnyCardRed,
  prism,
  retraceThePastBlue,
  shapelessFormBlue,
  shiftingWindsOfTheMysticBeastBlue,
  shiyanaDiamondGemini,
  snatchRed,
  talismanOfCremationBlue,
  teklovossen,
  zen,
} from "@tcg/flesh-and-blood-cards/simulator-scenario-cards";

import { catalogIds, toFabCardDefinition } from "./cards";
import { createEngine, matchFromEngine } from "./runtime";
import type { FabScenarioCollection } from "./types";

type ScenarioCard = Parameters<typeof toFabCardDefinition>[0];

function createNameCardEngine(input: {
  readonly seed: string;
  readonly cards: readonly ScenarioCard[];
  readonly player1: FabTestFixture["player1"];
  readonly player2: FabTestFixture["player2"];
  readonly firstPlayerId?: "player-1" | "player-2";
  readonly publicCardIdentities?: FabTestFixture["publicCardIdentities"];
}) {
  return createEngine({
    seed: input.seed,
    player1Id: "player-1",
    player2Id: "player-2",
    firstPlayerId: input.firstPlayerId ?? "player-1",
    cardDefinitions: Object.fromEntries(
      input.cards.map((card) => [card.canonicalId, toFabCardDefinition(card)]),
    ),
    player1: input.player1,
    player2: input.player2,
    ...(input.publicCardIdentities ? { publicCardIdentities: input.publicCardIdentities } : {}),
  });
}

function finish(engine: ReturnType<typeof createEngine>, scenarioId: string): FabPracticeMatch {
  const wait = engine.getRuntime().waitState();
  if (
    wait.kind !== "decision" ||
    wait.decision.kind !== "effect-resolution" ||
    wait.decision.presentation?.kind !== "card-name"
  ) {
    throw new Error(`${scenarioId} did not reach its semantic card-name decision.`);
  }
  return matchFromEngine(engine, `fab-scenario-${scenarioId}`);
}

function passPriorityToNameDecision(
  engine: ReturnType<typeof createEngine>,
  scenarioId: string,
  defendingHero?: ScenarioCard,
): FabPracticeMatch {
  for (let step = 0; step < 40; step += 1) {
    const wait = engine.getRuntime().waitState();
    if (wait.kind === "decision") return finish(engine, scenarioId);
    if (wait.kind === "priority") {
      engine.pass(wait.playerId);
      continue;
    }
    if (wait.kind === "defense-declaration" && defendingHero) {
      engine.as(defendingHero).defendWith();
      continue;
    }
    throw new Error(`${scenarioId} stopped at ${wait.kind} before its card-name decision.`);
  }
  throw new Error(`${scenarioId} did not reach its card-name decision in 40 moves.`);
}

function bootBlessingOfThemis(): FabPracticeMatch {
  const id = "name-card-blessing-of-themis";
  const engine = createNameCardEngine({
    seed: id,
    cards: [blessingOfThemisYellow, snatchRed, dash],
    player1: {
      heroCardId: catalogIds.bravo,
      hand: [blessingOfThemisYellow.canonicalId],
      banished: [{ card: snatchRed.canonicalId, state: { faceDown: false } }],
      actionPoints: 1,
      deck: 8,
    },
    player2: { heroCardId: dash.canonicalId, hand: [], deck: 8 },
  });
  engine.as(catalogIds.bravo).play(blessingOfThemisYellow);
  return passPriorityToNameDecision(engine, id);
}

function bootCensor(): FabPracticeMatch {
  const id = "name-card-censor";
  const engine = createNameCardEngine({
    seed: id,
    cards: [censorRed, snatchRed, dash],
    player1: {
      heroCardId: catalogIds.bravo,
      hand: [censorRed.canonicalId],
      resourcePoints: 1,
      actionPoints: 1,
      deck: 8,
    },
    player2: { heroCardId: dash.canonicalId, hand: [snatchRed.canonicalId], deck: 8 },
  });
  engine.as(catalogIds.bravo).playAttack(censorRed);
  return passPriorityToNameDecision(engine, id, dash);
}

function bootChainsOfEminence(): FabPracticeMatch {
  const id = "name-card-chains-of-eminence";
  const engine = createNameCardEngine({
    seed: id,
    cards: [chainsOfEminenceRed, snatchRed, dash],
    player1: {
      heroCardId: dash.canonicalId,
      hand: [chainsOfEminenceRed.canonicalId, snatchRed.canonicalId],
      actionPoints: 1,
      deck: 8,
    },
    player2: { heroCardId: catalogIds.bravo, hand: [], deck: 8 },
  });
  engine.as(dash).play(chainsOfEminenceRed);
  return passPriorityToNameDecision(engine, id);
}

function bootHeadLeadsTheTail(): FabPracticeMatch {
  const id = "name-card-head-leads-the-tail";
  const engine = createNameCardEngine({
    seed: id,
    cards: [headLeadsTheTailRed, snatchRed, katsu, dash],
    player1: {
      heroCardId: katsu.canonicalId,
      hand: [headLeadsTheTailRed.canonicalId, snatchRed.canonicalId],
      resourcePoints: 1,
      actionPoints: 1,
      deck: 8,
    },
    player2: { heroCardId: dash.canonicalId, hand: [], deck: 8 },
  });
  engine.as(katsu).playAttack(headLeadsTheTailRed, { stopAt: "on-attack" });
  return finish(engine, id);
}

function bootImperialEdict(): FabPracticeMatch {
  const id = "name-card-imperial-edict";
  const engine = createNameCardEngine({
    seed: id,
    cards: [imperialEdictRed, snatchRed, emperorDracaiOfAesir, dash],
    player1: {
      heroCardId: emperorDracaiOfAesir.canonicalId,
      arena: [imperialEdictRed.canonicalId],
      actionPoints: 1,
      deck: 8,
    },
    player2: { heroCardId: dash.canonicalId, hand: [snatchRed.canonicalId], deck: 8 },
  });
  engine.as(emperorDracaiOfAesir).activate(imperialEdictRed);
  return passPriorityToNameDecision(engine, id);
}

function bootLeaveEmSpeechless(): FabPracticeMatch {
  const id = "name-card-leave-em-speechless";
  const engine = createNameCardEngine({
    seed: id,
    cards: [leaveEmSpeechlessBlue, snatchRed, dash],
    player1: {
      heroCardId: catalogIds.bravo,
      hand: [leaveEmSpeechlessBlue.canonicalId],
      actionPoints: 1,
      deck: 8,
    },
    player2: { heroCardId: dash.canonicalId, hand: [snatchRed.canonicalId], deck: 8 },
  });
  engine.as(catalogIds.bravo).play(leaveEmSpeechlessBlue);
  return passPriorityToNameDecision(engine, id);
}

function bootNullTimeZone(): FabPracticeMatch {
  const id = "name-card-null-time-zone";
  const engine = createNameCardEngine({
    seed: id,
    cards: [nullTimeZoneBlue, snatchRed, teklovossen, dash],
    player1: {
      heroCardId: teklovossen.canonicalId,
      hand: [nullTimeZoneBlue.canonicalId, snatchRed.canonicalId],
      actionPoints: 1,
      deck: 8,
    },
    player2: { heroCardId: dash.canonicalId, hand: [], deck: 8 },
  });
  engine.as(teklovossen).play(nullTimeZoneBlue);
  return passPriorityToNameDecision(engine, id);
}

function bootPhantasmalSymbiosis(): FabPracticeMatch {
  const id = "name-card-phantasmal-symbiosis";
  const engine = createNameCardEngine({
    seed: id,
    cards: [phantasmalSymbiosisYellow, prism, dash],
    player1: {
      heroCardId: prism.canonicalId,
      hand: [phantasmalSymbiosisYellow.canonicalId],
      resourcePoints: 1,
      actionPoints: 1,
      deck: 8,
    },
    player2: { heroCardId: dash.canonicalId, hand: [], deck: 8 },
  });
  engine.as(prism).playAttack(phantasmalSymbiosisYellow, { stopAt: "on-attack" });
  return finish(engine, id);
}

function bootPickACardAnyCard(): FabPracticeMatch {
  const id = "name-card-pick-a-card-any-card";
  const engine = createNameCardEngine({
    seed: id,
    cards: [pickACardAnyCardRed, snatchRed, dash],
    player1: {
      heroCardId: dash.canonicalId,
      hand: [pickACardAnyCardRed.canonicalId],
      actionPoints: 1,
      deck: 8,
    },
    player2: { heroCardId: catalogIds.bravo, hand: [snatchRed.canonicalId], deck: 8 },
  });
  engine.as(dash).play(pickACardAnyCardRed);
  engine.passBoth();
  return finish(engine, id);
}

function bootRetraceThePast(): FabPracticeMatch {
  const id = "name-card-retrace-the-past";
  const engine = createNameCardEngine({
    seed: id,
    cards: [gustwaveOfTheSecondWindRed, retraceThePastBlue, snatchRed, katsu, dash],
    player1: {
      heroCardId: katsu.canonicalId,
      hand: [
        gustwaveOfTheSecondWindRed.canonicalId,
        retraceThePastBlue.canonicalId,
        snatchRed.canonicalId,
      ],
      actionPoints: 2,
      deck: 8,
    },
    player2: { heroCardId: dash.canonicalId, hand: [], deck: 8 },
  });
  const Katsu = engine.as(katsu);
  Katsu.playAttack(gustwaveOfTheSecondWindRed);
  engine.advanceUntil({ stopAt: "resolution", optionals: "decline", ordering: "listed" });
  Katsu.playAttack(retraceThePastBlue, { stopAt: "on-attack" });
  return finish(engine, id);
}

function bootShapelessForm(): FabPracticeMatch {
  const id = "name-card-shapeless-form";
  const engine = createNameCardEngine({
    seed: id,
    cards: [shapelessFormBlue, crouchingTiger, snatchRed, zen, dash],
    player1: {
      heroCardId: zen.canonicalId,
      hand: [shapelessFormBlue.canonicalId, crouchingTiger.canonicalId, snatchRed.canonicalId],
      actionPoints: 1,
      deck: 8,
    },
    player2: { heroCardId: dash.canonicalId, hand: [], deck: 8 },
  });
  const Zen = engine.as(zen);
  Zen.playAttack(shapelessFormBlue);
  engine.advanceUntil({ stopAt: "resolution" });
  Zen.playAttack(crouchingTiger, { stopAt: "on-attack" });
  return finish(engine, id);
}

function bootShiftingWinds(): FabPracticeMatch {
  const id = "name-card-shifting-winds-of-the-mystic-beast";
  const engine = createNameCardEngine({
    seed: id,
    cards: [shiftingWindsOfTheMysticBeastBlue, crouchingTiger, snatchRed, zen, dash],
    player1: {
      heroCardId: zen.canonicalId,
      hand: [
        shiftingWindsOfTheMysticBeastBlue.canonicalId,
        crouchingTiger.canonicalId,
        snatchRed.canonicalId,
      ],
      resourcePoints: 1,
      actionPoints: 1,
      deck: 8,
    },
    player2: { heroCardId: dash.canonicalId, hand: [], deck: 8 },
  });
  const Zen = engine.as(zen);
  Zen.play(shiftingWindsOfTheMysticBeastBlue);
  engine.helpers.resolveUntilIdle();
  Zen.playAttack(crouchingTiger, { stopAt: "on-attack" });
  return finish(engine, id);
}

function bootTalismanOfCremation(): FabPracticeMatch {
  const id = "name-card-talisman-of-cremation";
  const engine = createNameCardEngine({
    seed: id,
    cards: [talismanOfCremationBlue, nimblismBlue, snatchRed, dash],
    player1: {
      heroCardId: dash.canonicalId,
      arena: [talismanOfCremationBlue.canonicalId],
      hand: [nimblismBlue.canonicalId],
      actionPoints: 1,
      deck: 8,
    },
    player2: {
      heroCardId: catalogIds.bravo,
      hand: [],
      graveyard: [snatchRed.canonicalId],
      deck: 8,
    },
  });
  engine.as(dash).play(nimblismBlue);
  engine.passBoth();
  return finish(engine, id);
}

function bootHunterOrHunted(): FabPracticeMatch {
  const id = "name-card-hunter-or-hunted";
  const engine = createNameCardEngine({
    seed: id,
    cards: [hunterOrHuntedBlue, arakni, snatchRed, dash],
    player1: {
      heroCardId: dash.canonicalId,
      hand: [snatchRed.canonicalId],
      actionPoints: 1,
      deck: 8,
    },
    player2: {
      heroCardId: arakni.canonicalId,
      hand: [hunterOrHuntedBlue.canonicalId],
      resourcePoints: 3,
      deck: 8,
    },
  });
  const Dash = engine.as(dash);
  const Arakni = engine.as(arakni);
  Dash.playAttack(snatchRed);
  engine.toReaction("defender");
  Arakni.must.playReaction(hunterOrHuntedBlue);
  engine.passBoth();
  Arakni.decline();
  engine.passBoth();
  engine.passBoth();
  return finish(engine, id);
}

function bootMaskOfManyFaces(): FabPracticeMatch {
  const id = "name-card-mask-of-many-faces";
  const engine = createNameCardEngine({
    seed: id,
    cards: [maskOfManyFaces, benjiThePiercingWind, snatchRed, dash],
    player1: {
      heroCardId: benjiThePiercingWind.canonicalId,
      head: [maskOfManyFaces.canonicalId],
      hand: [snatchRed.canonicalId],
      resourcePoints: 1,
      actionPoints: 1,
      deck: 8,
    },
    player2: { heroCardId: dash.canonicalId, hand: [], deck: 8 },
  });
  engine.as(benjiThePiercingWind).activate(maskOfManyFaces);
  return passPriorityToNameDecision(engine, id);
}

function bootEmbodyGreatness(): FabPracticeMatch {
  const id = "name-card-embody-greatness";
  const engine = createNameCardEngine({
    seed: id,
    cards: [embodyGreatnessYellow, shiyanaDiamondGemini, bravoShowstopper, snatchRed, dash],
    publicCardIdentities: [
      {
        canonicalId: bravoShowstopper.canonicalId,
        names: ["Bravo, Showstopper"],
        isHero: true,
        legalInLivingLegend: true,
      },
      { canonicalId: snatchRed.canonicalId, names: ["Snatch"] },
    ],
    player1: {
      heroCardId: dash.canonicalId,
      hand: [snatchRed.canonicalId],
      actionPoints: 1,
      deck: 8,
    },
    player2: {
      heroCardId: shiyanaDiamondGemini.canonicalId,
      hand: [embodyGreatnessYellow.canonicalId],
      inventory: [bravoShowstopper.canonicalId],
      deck: 8,
    },
  });
  engine.as(dash).playAttack(snatchRed);
  engine.toReaction("defender");
  engine.as(shiyanaDiamondGemini).play(embodyGreatnessYellow);
  engine.passBoth();
  return finish(engine, id);
}

export const NAME_CARD_SCENARIOS: FabScenarioCollection = {
  "name-card-blessing-of-themis": scenario(
    "name-card-blessing-of-themis",
    "Blessing of Themis",
    "Face-up banished names are suggested; face-down cards stay private.",
    "player-1",
    bootBlessingOfThemis,
  ),
  "name-card-censor": scenario(
    "name-card-censor",
    "Censor",
    "A hit reached through real combat offers only currently visible shortcuts.",
    "player-1",
    bootCensor,
  ),
  "name-card-chains-of-eminence": scenario(
    "name-card-chains-of-eminence",
    "Chains of Eminence",
    "The entering aura can use the controller's hand and visible table names.",
    "player-1",
    bootChainsOfEminence,
  ),
  "name-card-head-leads-the-tail": scenario(
    "name-card-head-leads-the-tail",
    "Head Leads the Tail",
    "The attack names another card, with hand and combat-chain shortcuts.",
    "player-1",
    bootHeadLeadsTheTail,
  ),
  "name-card-imperial-edict": scenario(
    "name-card-imperial-edict",
    "Imperial Edict",
    "The Royal branch reveals the opposing hand before its names are suggested.",
    "player-1",
    bootImperialEdict,
  ),
  "name-card-leave-em-speechless": scenario(
    "name-card-leave-em-speechless",
    "Leave 'em Speechless",
    "The entering aura reaches a naming decision without exposing either deck.",
    "player-1",
    bootLeaveEmSpeechless,
  ),
  "name-card-null-time-zone": scenario(
    "name-card-null-time-zone",
    "Null Time Zone",
    "The item suggests the controller's hand and public table information.",
    "player-1",
    bootNullTimeZone,
  ),
  "name-card-phantasmal-symbiosis": scenario(
    "name-card-phantasmal-symbiosis",
    "Phantasmal Symbiosis",
    "The attack is on the chain when its visible-card shortcuts appear.",
    "player-1",
    bootPhantasmalSymbiosis,
  ),
  "name-card-pick-a-card-any-card": scenario(
    "name-card-pick-a-card-any-card",
    "Pick a Card, Any Card",
    "Only the hand this effect looked at is offered as a private shortcut.",
    "player-1",
    bootPickACardAnyCard,
  ),
  "name-card-retrace-the-past": scenario(
    "name-card-retrace-the-past",
    "Retrace the Past",
    "A real Gustwave link enables Retrace, then the remaining hand is suggested.",
    "player-1",
    bootRetraceThePast,
  ),
  "name-card-shapeless-form": scenario(
    "name-card-shapeless-form",
    "Shapeless Form",
    "An ephemeral Crouching Tiger triggers the naming decision after a real first link.",
    "player-1",
    bootShapelessForm,
  ),
  "name-card-shifting-winds-of-the-mystic-beast": scenario(
    "name-card-shifting-winds-of-the-mystic-beast",
    "Shifting Winds of the Mystic Beast",
    "A later Crouching Tiger opens the delayed naming trigger with hand shortcuts.",
    "player-1",
    bootShiftingWinds,
  ),
  "name-card-talisman-of-cremation": scenario(
    "name-card-talisman-of-cremation",
    "Talisman of Cremation",
    "The opponent's public graveyard supplies the relevant names.",
    "player-1",
    bootTalismanOfCremation,
  ),
  "name-card-hunter-or-hunted": scenario(
    "name-card-hunter-or-hunted",
    "Hunter or Hunted?",
    "A legally played defense reaction reaches its guess without inspecting deck identities.",
    "player-2",
    bootHunterOrHunted,
  ),
  "name-card-mask-of-many-faces": scenario(
    "name-card-mask-of-many-faces",
    "Mask of Many Faces",
    "The paid instant activation suggests the next attack already in hand.",
    "player-1",
    bootMaskOfManyFaces,
  ),
  "name-card-embody-greatness": scenario(
    "name-card-embody-greatness",
    "Embody Greatness",
    "Only Living Legend-legal hero identities are searchable during combat.",
    "player-2",
    bootEmbodyGreatness,
  ),
};

function scenario(
  id: string,
  cardName: string,
  description: string,
  viewerId: "player-1" | "player-2",
  boot: () => FabPracticeMatch,
) {
  return {
    id,
    label: `Name a card · ${cardName}`,
    description,
    group: "name-card" as const,
    tags: ["engine", "name-card", "privacy", "real-turn", "real-card"],
    viewerId,
    botMode: "off" as const,
    boot,
  };
}
