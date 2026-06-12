import type { CharacterCard } from "@tcg/lorcana-types";
import { minnieMouseStorytellerI18n } from "./031-minnie-mouse-storyteller.i18n";

export const minnieMouseStoryteller: CharacterCard = {
  id: "hMA",
  canonicalId: "ci_hMA",
  reprints: ["set7-031"],
  cardType: "character",
  name: "Minnie Mouse",
  version: "Storyteller",
  inkType: ["amber"],
  set: "007",
  cardNumber: 31,
  rarity: "legendary",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 0,
  inkable: false,
  externalIds: {
    lorcast: "crd_9e82c244c06f495eb4de6ae7915cd575",
    tcgPlayer: 619424,
  },
  text: [
    {
      title: "GATHER AROUND",
      description: "Whenever you play a character, this character gets +1 {L} this turn.",
    },
    {
      title: "JUST ONE MORE",
      description:
        "Whenever this character quests, chosen opposing character loses {S} equal to this character's {L} until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "2i4-1",
      name: "GATHER AROUND",
      text: "GATHER AROUND Whenever you play a character, this character gets +1 {L} this turn.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
    {
      effect: {
        duration: "until-start-of-next-turn",
        modifier: {
          type: "difference",
          left: 0,
          right: {
            type: "source-attribute",
            attribute: "lore",
          },
        },
        stat: "strength",
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "modify-stat",
      },
      id: "2i4-2",
      name: "JUST ONE MORE",
      text: "JUST ONE MORE Whenever this character quests, chosen opposing character loses {S} equal to this character's {L} until the start of your next turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: minnieMouseStorytellerI18n,
};
