import type { CharacterCard } from "@tcg/lorcana-types";
import { ladyTremaineSinisterSocialiteEnchantedI18n } from "./233-lady-tremaine-sinister-socialite-enchanted.i18n";

import { boost } from "../../../helpers/abilities/boost";

export const ladyTremaineSinisterSocialiteEnchanted: CharacterCard = {
  id: "r4f",
  canonicalId: "ci_F4M",
  slug: "lorcana-ci_F4M",
  printings: [
    {
      id: "set10-233-enchanted",
      artId: "ci_F4M-enchanted",
      setCode: "set10",
      collectorNumber: "233",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set10-124"],
  cardType: "character",
  name: "Lady Tremaine",
  version: "Sinister Socialite",
  inkType: ["ruby"],
  franchise: "Cinderella",
  set: "010",
  cardNumber: 233,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 5,
  strength: 5,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_ee5abfdfaa9d469e93dd20e1253ed1d0",
    tcgPlayer: "660042",
  },
  text: [
    {
      title: "Boost 2 {I}",
    },
    {
      title: "EXPEDIENT SCHEMES",
      description:
        "Whenever this character quests, if you've put a card under her this turn, you may play an action with cost 5 or less from your discard for free, then put that action card on the bottom of your deck instead of into your discard.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Whisper"],
  abilities: [
    boost(2),
    {
      condition: {
        type: "put-card-under-self-this-turn",
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          steps: [
            {
              duration: "this-turn",
              replacement: {
                consumeOnApply: true,
                eventKinds: ["zone-change"],
                fromZones: ["play", "limbo"],
                replacementPosition: "bottom",
                replacementZone: "deck",
                targetRef: "selected-target",
                toZone: "discard",
                type: "zone-destination",
              },
              type: "create-replacement-effect",
            },
            {
              cardType: "action",
              cost: "free",
              costRestriction: {
                comparison: "less-or-equal",
                value: 5,
              },
              from: "discard",
              type: "play-card",
            },
          ],
          type: "sequence",
        },
        type: "optional",
      },
      id: "a1d-2",
      name: "EXPEDIENT SCHEMES",
      text: "EXPEDIENT SCHEMES Whenever this character quests, if you've put a card under her this turn, you may play an action with cost 5 or less from your discard for free, then put that action card on the bottom of your deck instead of into your discard.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: ladyTremaineSinisterSocialiteEnchantedI18n,
};
