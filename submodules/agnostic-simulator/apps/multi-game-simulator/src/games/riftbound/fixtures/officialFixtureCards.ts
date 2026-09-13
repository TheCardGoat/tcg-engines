import type { RiftboundClientCardDefinitionV1 } from "../state";

interface OfficialRiftboundFixtureCard {
  readonly id: string;
  readonly definition: RiftboundClientCardDefinitionV1;
}

/**
 * A small, deterministic slice of the official Riot Card Gallery.
 *
 * These are real Origins printings, not simulator placeholders. Keeping the
 * slice in source makes the visual route work offline and prevents catalog
 * ordering or availability from changing the fixture under test.
 *
 * Source: https://playriftbound.com/en-us/card-gallery/
 * Verified: 2026-07-27
 */
export const officialRiftboundFixtureCards = [
  {
    id: "ogn-056-298",
    definition: {
      name: "Adaptatron",
      cardType: "Unit",
      domains: ["Calm"],
      imageUrl:
        "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/a3ddb00a2a872eaceb96469739531414aa27455d-744x1039.png?accountingTag=RB",
    },
  },
  {
    id: "ogn-066a-298",
    definition: {
      name: "Ahri, Alluring",
      cardType: "Unit",
      domains: ["Calm"],
      imageUrl:
        "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/933f5d58cc0e27d017982306b9ae0f581c9c8d27-744x1039.png?accountingTag=RB",
    },
  },
  {
    id: "ogn-119a-298",
    definition: {
      name: "Ahri, Inquisitive",
      cardType: "Unit",
      domains: ["Mind"],
      imageUrl:
        "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/7adc5aa8dba66bf918b8140699cb3a74f7b0efb5-744x1039.png?accountingTag=RB",
    },
  },
  {
    id: "ogn-230-298",
    definition: {
      name: "Albus Ferros",
      cardType: "Unit",
      domains: ["Order"],
      imageUrl:
        "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/ec0be8d2a79196b689fccf9ee42ce8baa7e9c35e-744x1039.png?accountingTag=RB",
    },
  },
  {
    id: "ogn-148-298",
    definition: {
      name: "Anivia, Primal",
      cardType: "Unit",
      domains: ["Body"],
      imageUrl:
        "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/ca1a56035333e31b3a04d67ee9131bb4d533e5db-744x1039.png?accountingTag=RB",
    },
  },
  {
    id: "ogn-107-298",
    definition: {
      name: "Ava Achiever",
      cardType: "Unit",
      domains: ["Mind"],
      imageUrl:
        "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/93e91aa99eb09baa68dd95b0013a89d9ffde5240-744x1039.png?accountingTag=RB",
    },
  },
] as const satisfies readonly OfficialRiftboundFixtureCard[];
