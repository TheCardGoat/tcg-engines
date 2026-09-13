import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveCard,
} from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion, requireSingleFace } from "./class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "./decisions.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { blitzMage } from "../cards/DOA/allies/blitz-mage.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";

export function memoryRevealFixture(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  bonus: boolean,
  element: boolean,
  zone: "hand" | "memory" = "memory",
) {
  const base = createClassBonusTestChampion(card, bonus, "activation-discount"),
    face = requireSingleFace(base);
  const champion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
    ...base,
    layout: {
      kind: "single-faced",
      face: {
        ...face,
        elements: element ? ["LUXEM"] : ["NORM"],
        abilities: [
          {
            id: "memoryRevealer-a1",
            kind: "activated",
            activation: "ability",
            text: "Reveal one selected card for this fixture.",
            cost: { kind: "pay-reserve", amount: 0 },
            effect: {
              kind: "reveal",
              player: "controller",
              selection: {
                id: "revealed-card",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: { kind: "exactly", amount: 1 },
                candidates: {
                  kind: "card",
                  zones: ["memory", "hand"],
                  relationship: "zone-of",
                  player: "each-player",
                },
              },
            },
          },
          {
            id: "memoryRevealer-a2",
            kind: "activated",
            activation: "ability",
            text: "Deal 4 damage to this champion for the recovery fixture.",
            cost: { kind: "pay-reserve", amount: 0 },
            effect: {
              kind: "deal-damage",
              source: { kind: "source" },
              recipient: { kind: "source" },
              amount: 4,
            },
          },
        ],
      },
    },
  };
  const game = GrandArchiveTestEngine.startFixture({
    firstPlayer: "playerOne",
    playerOne: {
      champion,
      zones: {
        memory: [card, card, woodlandSquirrels],
        hand: [card],
        field: [giantTortoise, trainingSword],
        "main-deck": Array.from({ length: 10 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion,
      zones: {
        memory: [card],
        field: [blitzMage, woodlandSquirrels, giantTortoise, trainingSword],
        "main-deck": Array.from({ length: 10 }, () => woodlandSquirrels),
      },
    },
  });
  const p = game.player("player-one"),
    q = game.player("player-two"),
    hero = p.card(champion),
    foe = q.card(champion),
    source = p.cards(card, { zone })[0]!;
  p.activateAbility(champion, "memoryRevealer-a2");
  passEffectsStack(game);
  const reveal = (own: boolean) => {
    const actor = own ? p : q;
    if (!own) p.pass();
    actor.activateAbility(champion, "memoryRevealer-a1");
    passEffectsStack(game);
    answerDecision(game, "resolve-effect-choice", [source.objectId]);
    passEffectsStack(game);
  };
  return { game, p, q, hero, foe, source, reveal };
}
