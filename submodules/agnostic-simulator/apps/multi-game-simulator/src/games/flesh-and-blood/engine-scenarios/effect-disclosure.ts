import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { authorityOfAtayaBlue } from "@tcg/flesh-and-blood-cards/cards/resources/authority-of-ataya";
import { potionOfDJVuBlue } from "@tcg/flesh-and-blood-cards/cards/actions/potion-of-d-j-vu";
import { nimbleStrikeRed } from "@tcg/flesh-and-blood-cards/cards/actions/nimble-strike";
import { bravo } from "@tcg/flesh-and-blood-cards/cards/heroes/bravo";
import { dash } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { matchFromEngine } from "./runtime";
import type { FabScenarioCollection } from "./types";

function bootAuthorityEffect(hidden: boolean) {
  const engine = FabTestEngine.start(
    {
      hero: bravo,
      hand: [nimbleStrikeRed, authorityOfAtayaBlue],
      arena: [potionOfDJVuBlue],
      resourcePoints: 0,
      deck: 6,
    },
    { hero: dash, hand: [], deck: 6 },
  );
  engine.as(bravo).must.pitch(authorityOfAtayaBlue).playAttack(nimbleStrikeRed);
  engine.toReaction();
  if (hidden) {
    engine.closeCombat();
    engine.as(bravo).activate(potionOfDJVuBlue);
    engine.untilIdle();
  }
  return matchFromEngine(engine, `authority-effect-${hidden ? "hidden" : "public"}`);
}

export const EFFECT_DISCLOSURE_SCENARIOS = {
  "authority-effect-owner": {
    id: "authority-effect-owner",
    label: "Authority effect — owner",
    description: "Authority of Ataya's public pitch effect from its owner's seat.",
    group: "edge",
    tags: ["effects", "pitch", "visibility"],
    viewerId: "player-1",
    botMode: "off",
    boot: () => bootAuthorityEffect(false),
  },
  "authority-effect-opponent": {
    id: "authority-effect-opponent",
    label: "Authority effect — opponent",
    description: "The same public pitch effect from the opponent's seat.",
    group: "edge",
    tags: ["effects", "pitch", "visibility"],
    viewerId: "player-2",
    botMode: "off",
    boot: () => bootAuthorityEffect(false),
  },
  "authority-effect-hidden-source": {
    id: "authority-effect-hidden-source",
    label: "Authority effect — source in deck",
    description: "Potion of Déjà Vu hides Authority in the deck; its known effect remains visible.",
    group: "edge",
    tags: ["effects", "pitch", "visibility"],
    viewerId: "player-2",
    botMode: "off",
    boot: () => bootAuthorityEffect(true),
  },
} satisfies FabScenarioCollection;
