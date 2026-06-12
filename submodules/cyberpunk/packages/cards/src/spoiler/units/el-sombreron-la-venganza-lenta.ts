import type { SpoilerCardDefinition } from "@tcg/cyberpunk-types";

export const spoilerElSombreronLaVenganzaLenta = {
  id: "e6ab6b31-cf5d-4acb-9d83-ce57f1b6718f",
  externalId: "cyberpunk:el-sombreron-la-venganza-lenta",
  slug: "el-sombreron-la-venganza-lenta",
  name: "El Sombrerón",
  subname: "La Venganza Lenta",
  displayName: "El Sombrerón - La Venganza Lenta",
  rulesText: "ATTACK While fighting a rival Unit, double this Unit's power.",
  flavorText: null,
  color: "red",
  classifications: ["Ganger", "Valentino"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "019",
  printings: [
    {
      id: "5a113aef-cb0e-493b-98e4-bf5326462297",
      collectorNumber: "019",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b019.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b019.webp",
      set: {
        code: "spoiler",
        name: "Spoiler Set",
      },
      rarity: null,
      finish: "foil",
      artist: "Rafael de Latorre & Clonerh",
    },
  ],
  selectedPrintingId: "5a113aef-cb0e-493b-98e4-bf5326462297",
  artist: "Rafael de Latorre & Clonerh",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b019.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b019.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 4,
  timingTriggers: ["attack"],
  keywords: [],
  type: "unit",
  cost: 4,
  power: 4,
  abilities: [
    {
      kind: "triggered",
      text: "ATTACK While fighting a rival Unit, double this Unit's power.",
      trigger: {
        trigger: "attack",
      },
      source: {
        selector: "self",
      },
      conditions: [
        {
          condition: "fightKind",
          target: {
            selector: "self",
          },
          kind: "fight",
        },
      ],
      effects: [
        {
          effect: "multiplyPower",
          target: {
            selector: "self",
          },
          multiplier: 2,
          duration: "turn",
        },
      ],
    },
  ],
  reminderText: [],
} satisfies SpoilerCardDefinition;
