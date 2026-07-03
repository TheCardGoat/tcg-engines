import type { CharacterCard } from "@tcg/lorcana-types";
import { stitchTeamUnderdogP2ChallengeI18n } from "./p2-006-stitch-team-underdog-challenge.i18n";

export const stitchTeamUnderdogP2Challenge: CharacterCard = {
  id: "wDE",
  canonicalId: "ci_Jx1",
  slug: "lorcana-ci_Jx1",
  printings: [
    {
      id: "set5-p2-006-challenge",
      artId: "ci_Jx1-challenge",
      setCode: "set5",
      collectorNumber: "6",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set5-171"],
  cardType: "character",
  name: "Stitch",
  version: "Team Underdog",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "005",
  cardNumber: 6,
  rarity: "special",
  specialRarity: "challenge",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_67fb41c26e2a4f10bfe027e81169daaf",
    tcgPlayer: "561999",
  },
  text: [
    {
      title: "HEAVE HO!",
      description: "When you play this character, you may deal 2 damage to chosen character.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Alien"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 2,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "deal-damage",
        },
        type: "optional",
      },
      id: "jmz-1",
      name: "HEAVE HO!",
      text: "HEAVE HO! When you play this character, you may deal 2 damage to chosen character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: stitchTeamUnderdogP2ChallengeI18n,
};
