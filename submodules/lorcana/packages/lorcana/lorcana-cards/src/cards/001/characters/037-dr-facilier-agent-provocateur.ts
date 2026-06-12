import type { CharacterCard } from "@tcg/lorcana-types";
import { drFacilierAgentProvocateurI18n } from "./037-dr-facilier-agent-provocateur.i18n";

export const drFacilierAgentProvocateur: CharacterCard = {
  id: "Af3",
  canonicalId: "ci_Af3",
  reprints: ["set1-037"],
  cardType: "character",
  name: "Dr. Facilier",
  version: "Agent Provocateur",
  inkType: ["amethyst"],
  franchise: "Princess and the Frog",
  set: "001",
  cardNumber: 37,
  rarity: "rare",
  cost: 7,
  strength: 4,
  willpower: 5,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_a23c8618b0aa41f9b41b9f0603495380",
    tcgPlayer: 508723,
  },
  text: [
    {
      title: "Shift 5",
      description:
        "(You may pay 5 {I} to play this on top of one of your characters named Dr. Facilier.)",
    },
    {
      title: "INTO THE SHADOWS",
      description:
        "Whenever one of your other characters is banished in a challenge, you may return that card to your hand.",
    },
  ],
  classifications: ["Floodborn", "Villain", "Sorcerer"],
  abilities: [
    {
      id: "Af3-1",
      keyword: "Shift",
      cost: {
        ink: 5,
      },
      shiftTarget: "Dr. Facilier",
      type: "keyword",
      text: "**Shift 5** (You may pay 5 {I} to play this on top of one of your characters named Dr. Facilier.)",
    },
    {
      id: "Af3-2",
      name: "INTO THE SHADOWS",
      type: "triggered",
      sourceZones: ["play", "discard"],
      text: "**INTO THE SHADOWS** Whenever one of your other characters is banished in a challenge, you may return that card to your hand.",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
        restrictions: [
          {
            type: "in-challenge",
          },
        ],
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "return-to-hand",
          target: {
            ref: "trigger-source",
          },
        },
      },
    },
  ],
  i18n: drFacilierAgentProvocateurI18n,
};
