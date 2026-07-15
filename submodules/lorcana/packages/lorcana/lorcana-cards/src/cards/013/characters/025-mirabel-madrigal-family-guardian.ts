import type { CharacterCard } from "@tcg/lorcana-types";
import { mirabelMadrigalFamilyGuardianI18n } from "./025-mirabel-madrigal-family-guardian.i18n";

export const mirabelMadrigalFamilyGuardian: CharacterCard = {
  id: "rBA",
  canonicalId: "ci_rBA",
  slug: "lorcana-ci_rBA",
  printings: [
    {
      id: "set13-025",
      artId: "set13-025",
      setCode: "set13",
      collectorNumber: "25",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-025"],
  cardType: "character",
  name: "Mirabel Madrigal",
  version: "Family Guardian",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "013",
  cardNumber: 25,
  rarity: "rare",
  cost: 5,
  strength: 3,
  willpower: 7,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_5a213dcefc804ee98d09be0f1aad7328",
  },
  text: [
    {
      title: "MIRACULOUS PROTECTION",
      description:
        "Whenever you remove damage from one of your characters, you may ready them. If you do, they can't quest or challenge for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Madrigal"],
  abilities: [
    {
      id: "rBA-1",
      name: "MIRACULOUS PROTECTION",
      type: "triggered",
      trigger: {
        event: "remove-damage",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
        sourceFilter: {
          sourceController: "you",
        },
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "ready",
              target: {
                ref: "trigger-subject",
              },
            },
            {
              type: "restriction",
              restriction: "cant-quest-or-challenge",
              duration: "this-turn",
              target: {
                ref: "trigger-subject",
              },
            },
          ],
        },
      },
      text: "MIRACULOUS PROTECTION Whenever you remove damage from one of your characters, you may ready them. If you do, they can't quest or challenge for the rest of this turn.",
    },
  ],
  i18n: mirabelMadrigalFamilyGuardianI18n,
};
