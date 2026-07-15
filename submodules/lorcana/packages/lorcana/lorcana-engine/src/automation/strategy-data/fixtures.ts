import type { StrategyDeckDossier } from "./types";

export const BEST_AI_DECK_DOSSIERS: readonly StrategyDeckDossier[] = [
  {
    archetype: "midrange",
    colorPairId: "sapphire-steel",
    fixtureId: "steel-sapphire-midrange",
    label: "Steel Sapphire Midrange",
    signature:
      "0RS:4|49g:4|Dub:4|EfC:4|gPY:4|iaq:4|J1F:4|kw2:3|oBs:3|QiE:4|qUy:4|ron:1|sQ9:3|uh8:2|VpM:2|wQI:4|Y3G:4|z8J:2",
  },
  {
    archetype: "midrange",
    colorPairId: "sapphire-steel",
    fixtureId: "steel-sapphire-aggressive",
    label: "Steel Sapphire Aggressive",
    signature:
      "0RS:4|49g:4|Dub:4|EfC:4|gPY:4|iaq:4|J1F:4|kw2:4|oBs:2|QiE:4|qUy:4|sQ9:2|uh8:4|VpM:2|wQI:4|Y3G:4|z8J:2",
  },
  {
    archetype: "aggressive",
    colorPairId: "amber-steel",
    fixtureId: "amber-steel-goofy-lilo",
    label: "Amber Steel Goofy Lilo",
    signature:
      "3W0:4|404:4|7M2:4|BUx:4|cVT:1|D9h:4|dQB:4|DXq:2|I1B:4|lih:4|mTY:4|MzI:4|NLA:3|qUy:4|sQ9:4|XlN:2|ZCd:4",
  },
  {
    archetype: "aggressive",
    colorPairId: "amber-steel",
    fixtureId: "amber-steel-lilo-rapunzel",
    label: "Amber Steel Lilo Rapunzel",
    signature:
      "3W0:4|404:4|7M2:4|BUx:4|D9h:4|dQB:4|DXq:2|I1B:4|lih:4|mTY:4|MzI:4|NLA:2|qUy:4|sQ9:4|XlN:4|ZCd:4",
  },
  {
    archetype: "control",
    colorPairId: "amethyst-ruby",
    fixtureId: "amber-amethyst-control",
    label: "Amber Amethyst Control",
    signature:
      "7im:3|akT:4|APE:4|B2Y:4|e6l:4|EtL:2|IyC:4|mUL:4|nGJ:4|PX4:4|Ql7:3|QUY:4|qzx:4|R01:4|tM1:4|umw:4",
  },
  {
    archetype: "control",
    colorPairId: "amethyst-ruby",
    fixtureId: "amber-amethyst-aggressive",
    label: "Amber Amethyst Aggressive",
    signature:
      "7im:4|akT:4|APE:4|B2Y:4|e6l:4|EtL:2|IyC:4|mUL:4|nGJ:4|PX4:4|Ql7:2|QUY:4|qzx:4|R01:4|tM1:4|umw:4",
  },
  {
    archetype: "midrange",
    colorPairId: "amethyst-sapphire",
    fixtureId: "steel-amethyst-basil-genie",
    label: "Steel Amethyst Basil Genie",
    signature:
      "0RS:3|20T:3|5i2:2|8Sv:3|akT:4|b2t:2|B2Y:4|BB3:2|D7f:4|e6l:3|EfC:4|F8I:4|gPY:4|JlP:3|JOj:3|kZV:4|oD3:4|PX4:4",
  },
  {
    archetype: "aggressive",
    colorPairId: "amber-emerald",
    fixtureId: "emerald-amethyst-ink",
    label: "Emerald Amethyst Ink",
    signature:
      "05w:3|0V8:3|52C:2|AY1:4|c1H:4|DI6:1|F34:3|IAp:2|jsz:4|o61:2|oNE:4|owY:3|pzM:4|qaR:3|TUy:1|uCP:2|vEP:4|wMm:3|Y3X:1|ymd:1|YVY:2|Zv7:4",
  },
] as const;
