import type { SpoilerCardDefinition } from "@tcg/cyberpunk-types";

export const spoilerRidingNomad = {
  id: "20bcc767-29f0-4aa0-b842-4d4e546ed36e",
  externalId: "cyberpunk:riding-nomad",
  slug: "riding-nomad",
  name: "Riding Nomad",
  subname: null,
  displayName: "Riding Nomad",
  rulesText: "This Unit can attack spent rival Units the turn it's played.",
  flavorText: null,
  color: "green",
  classifications: ["Nomad"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "042",
  printings: [
    {
      id: "a8bce878-99ba-477f-bb71-25a2be401055",
      collectorNumber: "042",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b042.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b042.webp",
      set: {
        code: "spoiler",
        name: "Spoiler Set",
      },
      rarity: null,
      finish: "standard",
      artist: "Michal Ivan",
    },
  ],
  selectedPrintingId: "a8bce878-99ba-477f-bb71-25a2be401055",
  artist: "Michal Ivan",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b042.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b042.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 3,
  timingTriggers: [],
  keywords: [],
  type: "unit",
  cost: 6,
  power: 6,
  abilities: [
    {
      kind: "static",
      text: "This Unit can attack spent rival Units the turn it's played.",
      effects: [
        {
          effect: "grantRule",
          target: {
            selector: "self",
          },
          rule: "canAttackOnPlayedTurnAgainstUnits",
          duration: "continuous",
          conditions: [
            {
              condition: "playedThisTurn",
              target: {
                selector: "self",
              },
            },
          ],
        },
      ],
    },
  ],
  reminderText: [],
} satisfies SpoilerCardDefinition;
