import type { CharacterCard } from "@tcg/lorcana-types";
import { elisaMazaHardworkingDetectiveI18n } from "./016-elisa-maza-hardworking-detective.i18n";

export const elisaMazaHardworkingDetective: CharacterCard = {
  id: "itE",
  canonicalId: "ci_itE",
  slug: "lorcana-ci_itE",
  printings: [
    {
      id: "set14-016",
      artId: "set14-016",
      setCode: "set14",
      collectorNumber: "16",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-016"],
  cardType: "character",
  name: "Elisa Maza",
  version: "Hardworking Detective",
  inkType: ["amber"],
  franchise: "Gargoyles",
  set: "014",
  cardNumber: 16,
  rarity: "uncommon",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_816b5cef943b4639a101f20c79b654f4",
  },
  text: [
    {
      title: "FOLLOW THE TRAIL",
      description:
        "When you play this character, if you have another Detective character in play, chosen opponent reveals their hand and discards a non-character card of your choice.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Detective"],
  abilities: [
    {
      id: "itE-1",
      name: "FOLLOW THE TRAIL",
      type: "triggered",
      text: "FOLLOW THE TRAIL When you play this character, if you have another Detective character in play, chosen opponent reveals their hand and discards a non-character card of your choice.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardType: "character",
          excludeSelf: true,
          filters: [{ type: "has-classification", classification: "Detective" }],
        },
        comparison: { operator: "gte", value: 1 },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "reveal-hand",
            target: "OPPONENT",
          },
          {
            type: "discard",
            amount: 1,
            target: "OPPONENT",
            from: "hand",
            chosen: true,
            chosenBy: "you",
            filter: { notCardType: "character" },
          },
        ],
      },
    },
  ],
  i18n: elisaMazaHardworkingDetectiveI18n,
};
