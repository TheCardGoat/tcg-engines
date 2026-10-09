import type { CharacterCard } from "@tcg/lorcana-types";
import { mulanMartialArtsMasterI18n } from "./127-mulan-martial-arts-master.i18n";

export const mulanMartialArtsMaster: CharacterCard = {
  id: "BqG",
  canonicalId: "ci_BqG",
  slug: "lorcana-ci_BqG",
  printings: [
    {
      id: "set14-127",
      artId: "set14-127",
      setCode: "set14",
      collectorNumber: "127",
      rarity: "legendary",
      imageUrl: "",
    },
  ],
  reprints: ["set14-127"],
  cardType: "character",
  name: "Mulan",
  version: "Martial Arts Master",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "014",
  cardNumber: 127,
  rarity: "legendary",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "Way of the Hero",
      description:
        'When you play this character, chosen character gets +2 {S} and gains "Whenever this character challenges another character, draw a card" this turn.',
    },
    {
      title: "Warrior Spirit",
      description:
        "Whenever this character quests, chosen character gains Rush this turn. (They can challenge the turn they're played.)",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [
    {
      id: "BqG-1",
      name: "Way of the Hero",
      type: "triggered",
      text: 'Way of the Hero When you play this character, chosen character gets +2 {S} and gains "Whenever this character challenges another character, draw a card" this turn.',
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: 2,
            duration: "this-turn",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "grant-ability",
            duration: "this-turn",
            target: {
              ref: "previous-target",
            },
            ability: {
              id: "BqG-1-way-of-the-hero-challenge-draw",
              type: "triggered",
              text: "Whenever this character challenges another character, draw a card.",
              trigger: {
                event: "challenge",
                on: "SELF",
                timing: "whenever",
                restrictions: [{ type: "defender-is-character" }],
              },
              effect: {
                type: "draw",
                amount: 1,
                target: "CONTROLLER",
              },
            },
          },
        ],
      },
    },
    {
      id: "BqG-2",
      name: "Warrior Spirit",
      type: "triggered",
      text: "Warrior Spirit Whenever this character quests, chosen character gains Rush this turn. (They can challenge the turn they're played.)",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        duration: "this-turn",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
  i18n: mulanMartialArtsMasterI18n,
};
