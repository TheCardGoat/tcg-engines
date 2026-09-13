import { describe, expect, it } from "vitest";
import { getFleshAndBloodCard } from "@tcg/flesh-and-blood-cards/catalog";
import { dashIO } from "../../cards/src/cards/heroes/dash-i-o.ts";
import { dorintheaIronsong } from "../../cards/src/cards/heroes/dorinthea-ironsong.ts";
import { serBoltynBreakerOfDawn } from "../../cards/src/cards/heroes/ser-boltyn-breaker-of-dawn.ts";
import { shiyanaDiamondGemini } from "../../cards/src/cards/heroes/shiyana-diamond-gemini.ts";
import { puffinHightail } from "../../cards/src/cards/heroes/puffin-hightail.ts";
import { riptideLurkerOfTheDeep } from "../../cards/src/cards/heroes/riptide-lurker-of-the-deep.ts";
import { bravoShowstopper } from "../../cards/src/cards/heroes/bravo-showstopper.ts";
import { sparkOfGeniusYellow } from "../../cards/src/cards/actions/spark-of-genius.ts";
import { steelbladeSupremacyRed } from "../../cards/src/cards/actions/steelblade-supremacy.ts";
import { luminaAscensionYellow } from "../../cards/src/cards/actions/lumina-ascension.ts";
import { copperCogBlue } from "../../cards/src/cards/actions/copper-cog.ts";
import { cripplingCrushRed } from "../../cards/src/cards/actions/crippling-crush.ts";
import { deathmatchArena } from "../../cards/src/cards/actions/deathmatch-arena.ts";
import { pollyCranka } from "../../cards/src/cards/companions/polly-cranka.ts";
import { adaptiveAlphaMold } from "../../cards/src/cards/equipment/adaptive-alpha-mold.ts";
import { driftwoodQuiver } from "../../cards/src/cards/equipment/driftwood-quiver.ts";
import { quiverOfAbyssalDepths } from "../../cards/src/cards/equipment/quiver-of-abyssal-depths.ts";
import { steelbraidBuckler } from "../../cards/src/cards/equipment/steelbraid-buckler.ts";
import { fyendalSSpringTunic } from "../../cards/src/cards/equipment/fyendal-s-spring-tunic.ts";
import { deathDealer } from "../../cards/src/cards/weapons/death-dealer.ts";
import { anothos } from "../../cards/src/cards/weapons/anothos.ts";
import { hanabiBlaster } from "../../cards/src/cards/weapons/hanabi-blaster.ts";
import { gavelOfNaturalOrder } from "../../cards/src/cards/weapons/gavel-of-natural-order.ts";
import { brutusSummaRudis } from "../../cards/src/cards/heroes/brutus-summa-rudis.ts";
import { createFabValidationCard } from "./deck-validation-card.ts";
import {
  fabHeroMatchesMoniker,
  validateFabDeckConstruction,
  type FabValidationCard,
  type FabValidationSelection,
} from "./deck-validation.ts";
import type { FabCardDefinitionInput } from "./cards.ts";

// Owns the public deck-validation contract, using unmodified authored cards.
function card(definition: FabCardDefinitionInput): FabValidationCard {
  const projected = createFabValidationCard(definition);
  const metadata = getFleshAndBloodCard(projected.canonicalId);
  if (!metadata) throw new Error(`Missing catalog card ${projected.canonicalId}`);
  return createFabValidationCard(definition, metadata);
}
function selection(
  hero: FabCardDefinitionInput,
  pool: readonly FabCardDefinitionInput[],
  equipment: readonly (readonly [
    keyof FabValidationSelection["equipment"],
    FabCardDefinitionInput,
  ])[] = [],
) {
  const heroCard = card(hero);
  const entries = pool.map((definition) => ({
    canonicalId: card(definition).canonicalId,
    quantity: 1,
  }));
  const cards = Object.fromEntries(
    [heroCard, ...pool.map(card)].map((value) => [value.canonicalId, value]),
  );
  return validateFabDeckConstruction({
    mode: "selection",
    format: "ll",
    heroId: heroCard.canonicalId,
    entries,
    cards,
    relaxDeckSize: true,
    selection: {
      deck: [],
      equipment: Object.fromEntries(
        equipment.map(([slot, definition]) => [slot, card(definition).canonicalId]),
      ),
    },
  });
}
describe("FAB unified deck validation", () => {
  it.each([1, 2, 3])(
    "applies a format restriction independently of Legendary: %i copies",
    (quantity) => {
      const hero = card(bravoShowstopper),
        crush = card(cripplingCrushRed);
      for (const format of ["cc", "ll"] as const) {
        const result = validateFabDeckConstruction({
          mode: "registered",
          format,
          heroId: hero.canonicalId,
          cards: { [hero.canonicalId]: hero, [crush.canonicalId]: crush },
          entries: [{ canonicalId: crush.canonicalId, quantity }],
        });
        expect(result.issues.some((issue) => issue.code === "copy_limit")).toBe(
          format === "ll" && quantity > 1,
        );
        expect(result.issues.some((issue) => issue.code === "legendary")).toBe(false);
      }
    },
  );
  it.each([
    [dashIO, sparkOfGeniusYellow],
    [dorintheaIronsong, steelbladeSupremacyRed],
    [serBoltynBreakerOfDawn, luminaAscensionYellow],
    [shiyanaDiamondGemini, sparkOfGeniusYellow],
  ])("accepts matching monikers and Shiyana's explicit exception", (hero, specialization) => {
    expect(selection(hero, [specialization]).issues).toEqual([]);
  });
  it("rejects another hero's specialization", () => {
    expect(
      selection(dashIO, [steelbladeSupremacyRed]).issues.some(
        (issue) => issue.code === "specialization",
      ),
    ).toBe(true);
  });
  it("does not confuse a substring with a moniker", () => {
    expect(fabHeroMatchesMoniker(["Dash I/O"], "Ash")).toBe(false);
    expect(fabHeroMatchesMoniker(["Data Doll MKII"], "Data Doll")).toBe(true);
  });
  it("accepts a bow and quiver in either selection order", () => {
    for (const equipment of [
      [
        ["weapon1", deathDealer],
        ["weapon2", driftwoodQuiver],
      ],
      [
        ["weapon1", driftwoodQuiver],
        ["weapon2", deathDealer],
      ],
    ] as const)
      expect(
        selection(riptideLurkerOfTheDeep, [deathDealer, driftwoodQuiver], equipment).valid,
      ).toBe(true);
  });
  it("rejects a two-handed weapon plus an ordinary off-hand", () => {
    expect(
      selection(
        bravoShowstopper,
        [anothos, steelbraidBuckler],
        [
          ["weapon1", anothos],
          ["weapon2", steelbraidBuckler],
        ],
      ).issues.some((issue) => issue.code === "weapon-combination"),
    ).toBe(true);
  });
  it("rejects two quivers", () => {
    expect(
      selection(
        riptideLurkerOfTheDeep,
        [driftwoodQuiver, quiverOfAbyssalDepths],
        [
          ["weapon1", driftwoodQuiver],
          ["weapon2", quiverOfAbyssalDepths],
        ],
      ).issues.some((issue) => issue.code === "weapon-combination"),
    ).toBe(true);
  });
  it("rejects two off-hands", () => {
    expect(
      selection(
        bravoShowstopper,
        [steelbraidBuckler, steelbraidBuckler],
        [
          ["weapon1", steelbraidBuckler],
          ["weapon2", steelbraidBuckler],
        ],
      ).issues.some((issue) => issue.code === "weapon-combination"),
    ).toBe(true);
  });
  it("does not extend the quiver exception to a non-bow", () => {
    expect(
      selection(
        bravoShowstopper,
        [anothos, quiverOfAbyssalDepths],
        [
          ["weapon1", anothos],
          ["weapon2", quiverOfAbyssalDepths],
        ],
      ).issues.some((issue) => issue.code === "weapon-combination"),
    ).toBe(true);
  });
  it("checks Pairs on simultaneous equipment selection, not mere pool membership", () => {
    const pool = [gavelOfNaturalOrder, steelbraidBuckler];
    const alone = selection(brutusSummaRudis, pool, [["weapon1", gavelOfNaturalOrder]]);
    expect(alone.issues.some((issue) => issue.code === "pairs")).toBe(true);
    const paired = selection(brutusSummaRudis, pool, [
      ["weapon1", gavelOfNaturalOrder],
      ["weapon2", steelbraidBuckler],
    ]);
    expect(paired.issues.some((issue) => issue.code === "pairs")).toBe(false);
  });
  it("honors Perched alongside a non-bow two-hander", () => {
    expect(
      selection(
        puffinHightail,
        [hanabiBlaster, pollyCranka],
        [
          ["weapon1", hanabiBlaster],
          ["weapon2", pollyCranka],
        ],
      ).valid,
    ).toBe(true);
  });
  it("rejects a companion with the wrong hero metatype, including in inventory", () => {
    expect(
      selection(dashIO, [pollyCranka]).issues.some((issue) => issue.code === "hero-metatype"),
    ).toBe(true);
  });
  it.each(["head", "chest", "arms", "legs"] as const)("allows Modular in %s", (slot) => {
    expect(selection(dashIO, [adaptiveAlphaMold], [[slot, adaptiveAlphaMold]]).valid).toBe(true);
  });
  it("does not allow Modular in a weapon zone", () => {
    expect(
      selection(dashIO, [adaptiveAlphaMold], [["weapon1", adaptiveAlphaMold]]).issues.some(
        (issue) => issue.code === "wrong-equipment-slot",
      ),
    ).toBe(true);
  });
  it.each([1, 2])("counts Legendary across all registered entries: %i copies", (quantity) => {
    const hero = card(bravoShowstopper),
      legendary = card(deathmatchArena);
    const result = validateFabDeckConstruction({
      mode: "registered",
      format: "cc",
      heroId: hero.canonicalId,
      cards: { [hero.canonicalId]: hero, [legendary.canonicalId]: legendary },
      entries: Array.from({ length: quantity }, () => ({
        canonicalId: legendary.canonicalId,
        quantity: 1,
      })),
    });
    expect(result.issues.some((issue) => issue.code === "legendary")).toBe(quantity === 2);
  });
  it("does not treat Legendary rarity as the keyword", () => {
    const hero = card(bravoShowstopper),
      tunic = card(fyendalSSpringTunic);
    expect(tunic.rarities).toContain("L");
    const result = validateFabDeckConstruction({
      mode: "registered",
      format: "cc",
      heroId: hero.canonicalId,
      cards: { [hero.canonicalId]: hero, [tunic.canonicalId]: tunic },
      entries: [{ canonicalId: tunic.canonicalId, quantity: 2 }],
    });
    expect(
      result.issues.filter((issue) => issue.code === "legendary" || issue.code === "copy_limit"),
    ).toEqual([]);
  });
  it("accepts a complete 60-card Unlimited pool but rejects an undersized pool", () => {
    const hero = card(dashIO),
      cog = card(copperCogBlue);
    for (const quantity of [59, 60]) {
      const result = validateFabDeckConstruction({
        mode: "registered",
        format: "cc",
        heroId: hero.canonicalId,
        cards: { [hero.canonicalId]: hero, [cog.canonicalId]: cog },
        entries: [{ canonicalId: cog.canonicalId, quantity }],
      });
      expect(
        result.issues.filter((issue) => issue.code !== "format_legal").map((issue) => issue.code),
      ).toEqual(quantity === 59 ? ["cc_minimum"] : []);
    }
  });
  it("checks hero age and rarity through the same format entrypoint", () => {
    const hero = card(dashIO),
      cog = card(copperCogBlue);
    const result = validateFabDeckConstruction({
      mode: "registered",
      format: "silverAge",
      heroId: hero.canonicalId,
      cards: { [hero.canonicalId]: hero, [cog.canonicalId]: cog },
      entries: [{ canonicalId: cog.canonicalId, quantity: 40 }],
    });
    expect(result.issues.some((issue) => issue.code === "blitz_young_hero")).toBe(true);
  });
});
