import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";
import { structuredCards } from "@tcg/cyberpunk-cards";
import type { ScenarioId } from "./types";

export const CURRENT_CARD_QA_INCLUDED_SET_CODES = [
  "promo",
  "PRM01",
  "boxtoppersretail",
  "theheistretailstarterdeck",
  "embracingpowerretailstarterdeck",
  "welcometonightcityretail",
] as const;

export const CURRENT_CARD_QA_EXCLUDED_SET_CODES = ["alpha", "spoiler"] as const;

const includedSetCodes = new Set<string>(CURRENT_CARD_QA_INCLUDED_SET_CODES);
const excludedSetCodes = new Set<string>(CURRENT_CARD_QA_EXCLUDED_SET_CODES);
const broadCatalogScenarioIds = new Set<ScenarioId>([
  "retailCardCatalog",
  "retailProgramTargetBench",
  "retailCombatGigBench",
  "retailGearLegendBench",
  "retailPr2295Cards",
  "retailNewCardAbilities",
]);

export const currentCardQaCards = structuredCards.filter((card) =>
  includedSetCodes.has(card.set.code),
);

export const currentCardQaCardsBySet = groupCardsBy(currentCardQaCards, (card) => card.set.code);
export const currentCardQaCardsByType = groupCardsBy(currentCardQaCards, (card) => card.type);

export interface CurrentCardQaCase {
  readonly card: StructuredCardDefinition;
  readonly scenarioIds: readonly ScenarioId[];
  readonly note: string;
}

type CurrentCardQaCaseInput = readonly [
  setCode: string,
  slug: string,
  scenarioIds: readonly ScenarioId[],
  note: string,
];

const CURRENT_CARD_QA_CASE_INPUTS = [
  ["promo", "lucyna-kushinada", ["legendLucynaKushinada"], "Promo legend hydration."],
  [
    "welcometonightcityretail",
    "live-with-the-aftermath",
    ["progLiveWithTheAftermathRetail"],
    "Each player selects and defeats one of their Units.",
  ],
  [
    "PRM01",
    "rebecca-having-a-moment",
    ["legendRebeccaHavingAMomentPrm01"],
    "No-text promo Legend call.",
  ],
  [
    "welcometonightcityretail",
    "octant",
    ["unitOctantRetail"],
    "8+ Gig cost reduction, floored at 1.",
  ],
  [
    "boxtoppersretail",
    "goro-takemura-hands-unclean",
    ["legendGoroTakemuraHandsUnclean"],
    "GO SOLO plus BLOCKER legend.",
  ],
  [
    "boxtoppersretail",
    "jackie-welles-pour-one-out-for-me",
    ["legendJackieWellesPourOneOutForMe"],
    "Blue card trigger increases a Gig.",
  ],
  [
    "boxtoppersretail",
    "saburo-arasaka-stubborn-patriarch",
    ["legendSaburoArasakaStubbornPatriach"],
    "Arasaka attack power passive.",
  ],
  ["boxtoppersretail", "v-corporate-exile", ["legendVCorporateExile"], "Revealed GO SOLO legend."],
  [
    "boxtoppersretail",
    "yorinobu-arasaka-embracing-destruction",
    ["legendYorinobuArasakaEmbracingDestruction"],
    "First Arasaka attack trigger.",
  ],
  [
    "theheistretailstarterdeck",
    "jackie-welles-pour-one-out-for-me",
    ["legendTheHeistJackieWellesPourOneOutForMe"],
    "The Heist blue gear Gig trigger.",
  ],
  [
    "theheistretailstarterdeck",
    "v-corporate-exile",
    ["legendTheHeistVCorporateExile"],
    "The Heist GO SOLO legend.",
  ],
  [
    "theheistretailstarterdeck",
    "viktor-vektor-sit-down-and-relax",
    ["legendViktorVektorSitDownAndRelaxRetail"],
    "FLIP searches top deck for low-cost Gear.",
  ],
  [
    "theheistretailstarterdeck",
    "dexter-deshawn-one-last-chance",
    ["unitTheHeistDexterDeshawnOneLastChance"],
    "PLAY adjusts a friendly Gig.",
  ],
  [
    "theheistretailstarterdeck",
    "mt0d12-flathead",
    ["unitTheHeistMt0d12Flathead"],
    "Street Cred comparison prevents blocking.",
  ],
  [
    "embracingpowerretailstarterdeck",
    "goro-takemura-hands-unclean",
    ["legendEmbracingGoroTakemuraHandsUnclean"],
    "Embracing Power GO SOLO plus BLOCKER legend.",
  ],
  [
    "embracingpowerretailstarterdeck",
    "saburo-arasaka-stubborn-patriarch",
    ["legendEmbracingSaburoArasakaStubbornPatriarch"],
    "Embracing Power Arasaka attacker bonus.",
  ],
  [
    "embracingpowerretailstarterdeck",
    "yorinobu-arasaka-embracing-destruction",
    ["legendEmbracingYorinobuArasakaEmbracingDestruction"],
    "Embracing Power first Arasaka attack.",
  ],
  [
    "embracingpowerretailstarterdeck",
    "goro-takemura-losing-his-way",
    ["unitEmbracingGoroTakemuraLosingHisWay"],
    "Face-up Legends attack bonus.",
  ],
  [
    "embracingpowerretailstarterdeck",
    "minotaur",
    ["unitEmbracingMinotaur"],
    "Higher Street Cred defeats low-power Unit.",
  ],
  [
    "welcometonightcityretail",
    "adam-smasher-ender-of-legends",
    ["legendAdamSmasherEnderOfLegendsRetail"],
    "GO SOLO play trigger defeats rival Unit.",
  ],
  [
    "welcometonightcityretail",
    "alt-cunningham-soulkiller-architect",
    ["legendAltCunninghamSoulkillerArchitectRetail"],
    "Play Program from trash.",
  ],
  [
    "welcometonightcityretail",
    "dum-dum-maelstrom-triggerman",
    ["legendDumDumMaelstromTriggermanRetail"],
    "Defeat Gear to draw.",
  ],
  [
    "welcometonightcityretail",
    "evelyn-parker-beautiful-enigma",
    ["legendEvelynParkerBeautifulEnigmaRetail"],
    "Legend render and passive fixture.",
  ],
  [
    "welcometonightcityretail",
    "goro-takemura-vengeful-bodyguard",
    ["legendGoroTakemuraVengefulBodyguardRetail"],
    "Grants BLOCKER and power with a Gig pair.",
  ],
  [
    "welcometonightcityretail",
    "kerry-eurodyne-axe-attitude-audience",
    ["legendKerryEurodyneAxeAttitudeAudienceRetail"],
    "Gig reroll and min/max draw trigger board.",
  ],
  [
    "welcometonightcityretail",
    "panam-palmer-nomad-cavalry",
    ["legendPanamPalmerNomadCavalryRetail"],
    "Move Gear to Unit and ready it.",
  ],
  [
    "welcometonightcityretail",
    "river-ward-detective-on-the-hunt",
    ["legendRiverWardDetectiveOnTheHuntRetail"],
    "Play Gear from hand for free.",
  ],
  [
    "welcometonightcityretail",
    "royce-psycho-on-the-edge",
    ["legendRoycePsychoOnTheEdgeRetail"],
    "Gear-scaled GO SOLO power.",
  ],
  [
    "welcometonightcityretail",
    "sasha-yakovleva-won-t-let-you-down",
    ["legendSashaYakovlevaWonTLetYouDownRetail"],
    "Attack reveal power boost and defeated discard board.",
  ],
  [
    "welcometonightcityretail",
    "v-streetkid",
    ["legendVStreetkidRetail"],
    "CALL trashes 3 and recovers Braindance.",
  ],
  [
    "welcometonightcityretail",
    "6th-street-recruits",
    ["unit6thStreetRecruitsRetail"],
    "Friendly Unit stealing d6 can increase a Gig.",
  ],
  [
    "welcometonightcityretail",
    "adam-smasher-metal-over-meat",
    ["unitAdamSmasherMetalOverMeatRetail"],
    "PLAY defeats all other Units.",
  ],
  [
    "welcometonightcityretail",
    "augmented-negotiators",
    ["unitAugmentedNegotiatorsRetail"],
    "BLOCKER discard-trigger board.",
  ],
  [
    "welcometonightcityretail",
    "caliber-totentanz-s-top-dog",
    ["unitCaliberTotentanzSTopDogRetail"],
    "DEFEATED discard plus cost/Gig bonus.",
  ],
  [
    "welcometonightcityretail",
    "corpo-security",
    ["unitCorpoSecurity"],
    "BLOCKER plus can't attack.",
  ],
  [
    "welcometonightcityretail",
    "delamain-cab",
    ["unitDelamainCab"],
    "Vanilla 7-power Vehicle attack.",
  ],
  [
    "welcometonightcityretail",
    "el-sombrero-n-la-venganza-lenta",
    ["unitElSombreronLaVenganzaLentaRetail"],
    "ATTACK doubles fight power.",
  ],
  [
    "welcometonightcityretail",
    "emergency-atlus",
    ["unitEmergencyAtlus"],
    "Vanilla 7-power Vehicle Corpo.",
  ],
  [
    "welcometonightcityretail",
    "evelyn-parker-scheming-siren",
    ["unitEvelynParkerSchemingSiren"],
    "Draw when Gigs are stolen while spent.",
  ],
  [
    "welcometonightcityretail",
    "field-operator",
    ["unitFieldOperatorRetail"],
    "Even-Street-Cred draw board.",
  ],
  [
    "welcometonightcityretail",
    "gilded-mato-n",
    ["unitGildedMatonRetail"],
    "Defeat friendly Gear to defeat rival Unit.",
  ],
  [
    "welcometonightcityretail",
    "hanako-arasaka-in-a-gilded-cage",
    ["unitHanakoArasakaInAGildedCageRetail"],
    "PLAY reveals top deck and keeps cost matches.",
  ],
  [
    "welcometonightcityretail",
    "jacked-in-voodoo-boy",
    ["unitJackedInVoodooBoyRetail"],
    "Requires Program played this turn attack restriction.",
  ],
  [
    "welcometonightcityretail",
    "jackie-welles-ride-or-die-choom",
    ["unitJackieWellesRideOrDieChoom"],
    "+2 power per friendly Gig.",
  ],
  [
    "welcometonightcityretail",
    "kerry-eurodyne-the-last-rockerboy",
    ["unitKerryEurodyneTheLastRockerboyRetail"],
    "Max-value Gig ability draws two.",
  ],
  [
    "welcometonightcityretail",
    "la-llorona-ghost-of-the-past",
    ["unitLaLloronaGhostOfThePastRetail"],
    "BLOCKER Gig-increase trigger board.",
  ],
  [
    "welcometonightcityretail",
    "lizzy-wizzy-delicate-weapon",
    ["unitLizzyWizzyDelicateWeaponRetail"],
    "PLAY free low-cost Program from hand or trash.",
  ],
  [
    "welcometonightcityretail",
    "maman-brigitte-spirit-of-death",
    ["unitMamanBrigitteRetail"],
    "Discard two Programs to bottom-deck unequipped Unit.",
  ],
  [
    "welcometonightcityretail",
    "meredith-stout-stone-cold-corpo",
    ["unitMeredithStoutStoneColdCorpoRetail"],
    "Rival Gig decrease recovers from trash.",
  ],
  [
    "welcometonightcityretail",
    "misty-olszewski-mender-of-broken-spirits",
    ["unitMistyOlszewskiMenderOfBrokenSpiritsRetail"],
    "End-turn card-type reveal and Eddie ready board.",
  ],
  [
    "welcometonightcityretail",
    "modded-kusanagi",
    ["unitModdedKusanagiRetail"],
    "ADRENALINE and return-to-hand end effect.",
  ],
  [
    "welcometonightcityretail",
    "mox-inciters",
    ["unitMoxIncitersRetail"],
    "BLOCKER plus must-attack play-trigger board.",
  ],
  [
    "welcometonightcityretail",
    "nadia-fighting-through-grief",
    ["unitNadiaFightingThroughGriefRetail"],
    "Rival-controls-more-Gigs played-turn attack board.",
  ],
  [
    "welcometonightcityretail",
    "offduty-malfini",
    ["unitOffdutyMalfiniRetail"],
    "PLAY spends self and rival Unit.",
  ],
  [
    "welcometonightcityretail",
    "placide-voodoo-sentinel",
    ["unitPlacideVoodooSentinelRetail"],
    "PLAY discard Program to bottom-deck rival Unit.",
  ],
  [
    "welcometonightcityretail",
    "psycho-squad",
    ["unitPsychoSquadRetail"],
    "No-ability NCPD attack board.",
  ],
  [
    "welcometonightcityretail",
    "riding-nomad",
    ["unitRidingNomadRetail"],
    "ADRENALINE attack on played turn.",
  ],
  [
    "welcometonightcityretail",
    "royce-don-t-call-me-simon",
    ["unitRoyceDonTCallMeSimonHighCredRetail", "unitRoyceDonTCallMeSimonLowCredRetail"],
    "Street Cred above and below rival thresholds.",
  ],
  [
    "welcometonightcityretail",
    "sandayu-oda-hanako-s-guardian",
    ["unitSandayuOdaHanakoSGuardianRetail"],
    "Friendly value-pair spend and attack-on-play.",
  ],
  [
    "welcometonightcityretail",
    "saul-bright-stormrider",
    ["unitSaulBrightStormriderRetail"],
    "Other friendly Units attack aura plus end-turn ready board.",
  ],
  [
    "welcometonightcityretail",
    "screw-lovelorn-fool",
    ["unitScrewLovelornFoolRetail"],
    "DEFEATED recovery from trash board.",
  ],
  [
    "welcometonightcityretail",
    "secondhand-bombus",
    ["unitSecondhandBombus"],
    "BLOCKER plus can't attack.",
  ],
  [
    "welcometonightcityretail",
    "sketchy-ripper",
    ["unitSketchyRipperRetail"],
    "ATTACK top-3 Gear search board.",
  ],
  [
    "welcometonightcityretail",
    "swordwise-huscle",
    ["unitSwordwiseHuscle"],
    "Vanilla Arasaka Merc attack.",
  ],
  [
    "welcometonightcityretail",
    "t-bug-amateur-philosopher",
    ["unitTBugAmateurPhilosopher"],
    "Vanilla Netrunner Merc attack.",
  ],
  [
    "welcometonightcityretail",
    "viktor-vektor-you-might-feel-a-little-pinch",
    ["unitViktorVektorYouMightFeelALittlePinchRetail"],
    "Trash Cyberware equip board.",
  ],
  [
    "welcometonightcityretail",
    "wraith-marauders",
    ["unitWraithMaraudersRetail"],
    "Steal Gig then ready matching-power Unit.",
  ],
  [
    "welcometonightcityretail",
    "yorinobu-arasaka-steel-dragon",
    ["unitYorinobuArasakaSteelDragonRetail"],
    "PLAY free low-cost Unit plus Arasaka defeat trigger board.",
  ],
  [
    "welcometonightcityretail",
    "dying-night-v-s-pistol",
    ["gearDyingNightHighCred", "gearDyingNightLowCred"],
    "Street Cred high and low attack-trigger Gear removal.",
  ],
  [
    "welcometonightcityretail",
    "gorilla-arms",
    ["gearGorillaArmsRetail"],
    "Steal unshared-value rival Gig.",
  ],
  [
    "welcometonightcityretail",
    "kiroshi-optics",
    ["gearKiroshiOptics", "gearKiroshiOpticsNoFaceDown"],
    "Face-down Legend and no-target attack-trigger cases.",
  ],
  [
    "welcometonightcityretail",
    "mandibular-upgrade",
    ["gearMandibularUpgrade"],
    "Gear-granted BLOCKER redirect.",
  ],
  [
    "welcometonightcityretail",
    "mantis-blades",
    ["gearMantisBlades", "gearAttachToGoSoloLegend"],
    "Power boost and GO SOLO Legend attachment.",
  ],
  [
    "welcometonightcityretail",
    "overwatch-panam-s-gift",
    ["gearOverwatchPanamsGiftRetail"],
    "Quick Gear activated discard-to-defeat board.",
  ],
  ["welcometonightcityretail", "sandevistan", ["gearSandevistan"], "Attack-on-play against Units."],
  [
    "welcometonightcityretail",
    "satori-sword-of-saburo",
    ["gearSatoriSwordOfSaburo"],
    "Draw on fight win.",
  ],
  [
    "welcometonightcityretail",
    "zetatech-faceplate",
    ["gearZetatechFaceplateRetail"],
    "Spend trigger adjusts Gig and draws.",
  ],
  [
    "welcometonightcityretail",
    "afterparty-at-lizzie-s",
    ["progAfterpartyAtLizzies"],
    "Rival Gig adjust with matching-value draw.",
  ],
  [
    "welcometonightcityretail",
    "all-is-lost",
    ["progAllIsLostRetail"],
    "Trash 3 and recover Unit board.",
  ],
  [
    "welcometonightcityretail",
    "bootleg-black-sapphire-show",
    ["progBootlegBlackSapphireShowRetail"],
    "Sells deck and draws from odd/even Gigs.",
  ],
  [
    "welcometonightcityretail",
    "carnage-at-the-colosseum",
    ["progCarnageAtTheColosseumRetail", "progCarnageAtTheColosseumCostReduction"],
    "Defeat weaker rival Unit plus 8+ Gig cost reduction.",
  ],
  [
    "welcometonightcityretail",
    "chrome-reverie",
    ["progChromeReverieRetail"],
    "Minimum Gig and free Legend call.",
  ],
  [
    "welcometonightcityretail",
    "corporate-surveillance",
    ["progCorporateSurveillance", "progCorporateSurveillanceNoTargets"],
    "Low-cost target and no-target cases.",
  ],
  [
    "welcometonightcityretail",
    "cyberpsychosis",
    ["progCyberpsychosisRetail"],
    "Equipped Unit buff with additional spend cost.",
  ],
  [
    "welcometonightcityretail",
    "floor-it",
    ["progFloorIt", "progFloorItNoTargets"],
    "Spent low-cost bounce and no-target cases.",
  ],
  [
    "welcometonightcityretail",
    "fool-on-the-hill",
    ["progFoolOnTheHill"],
    "Rival reveal-destination Program with hand/trash choice.",
  ],
  [
    "welcometonightcityretail",
    "industrial-assembly",
    ["progIndustrialAssembly", "progIndustrialAssemblyHighCred"],
    "Low and 7+ Street Cred Gig increase cases.",
  ],
  [
    "welcometonightcityretail",
    "over-the-edge",
    ["progOverTheEdgeRetail"],
    "Friendly d20 threshold defeat board.",
  ],
  [
    "welcometonightcityretail",
    "peace-offering",
    ["progPeaceOfferingRetail"],
    "Copy Gig value and draw from pair.",
  ],
  [
    "welcometonightcityretail",
    "reboot-optics",
    ["progRebootOptics", "progRebootOpticsEmptyField"],
    "Friendly Unit buff and no-target cases.",
  ],
  [
    "welcometonightcityretail",
    "take-control",
    ["progTakeControlRetail"],
    "Quick attacker mitigation board.",
  ],
] as const satisfies readonly CurrentCardQaCaseInput[];

export const currentCardQaCases: readonly CurrentCardQaCase[] = CURRENT_CARD_QA_CASE_INPUTS.map(
  ([setCode, slug, scenarioIds, note]) => ({
    card: findCurrentCard(setCode, slug),
    scenarioIds,
    note,
  }),
);

export const currentCardQaScenarioIds: readonly ScenarioId[] = [
  ...new Set(currentCardQaCases.flatMap((entry) => entry.scenarioIds)),
];

function findCurrentCard(setCode: string, slug: string): StructuredCardDefinition {
  const found = currentCardQaCards.find((card) => card.set.code === setCode && card.slug === slug);
  if (!found) {
    throw new Error(`Unknown current-card QA card: ${setCode}:${slug}`);
  }
  return found;
}

function groupCardsBy(
  cards: readonly StructuredCardDefinition[],
  keyForCard: (card: StructuredCardDefinition) => string,
): Record<string, readonly StructuredCardDefinition[]> {
  const groups: Record<string, StructuredCardDefinition[]> = {};
  for (const card of cards) {
    const key = keyForCard(card);
    groups[key] ??= [];
    groups[key].push(card);
  }
  return groups;
}

export function assertCurrentCardQaCatalog(): void {
  const unexpectedSets = currentCardQaCards.filter((card) => excludedSetCodes.has(card.set.code));
  if (unexpectedSets.length > 0) {
    throw new Error(
      `Current-card QA catalog unexpectedly included excluded sets: ${unexpectedSets
        .map((card) => `${card.set.code}:${card.slug}`)
        .join(", ")}`,
    );
  }

  const missingSets = CURRENT_CARD_QA_INCLUDED_SET_CODES.filter(
    (setCode) => (currentCardQaCardsBySet[setCode]?.length ?? 0) === 0,
  );
  if (missingSets.length > 0) {
    throw new Error(`Current-card QA catalog is missing set(s): ${missingSets.join(", ")}`);
  }

  const broadCatalogCases = currentCardQaCases.filter((entry) =>
    entry.scenarioIds.some((scenarioId) => broadCatalogScenarioIds.has(scenarioId)),
  );
  if (broadCatalogCases.length > 0) {
    throw new Error(
      `Current-card QA cases must use authored card-specific scenarios, not broad catalogs: ${broadCatalogCases
        .map((entry) => `${entry.card.set.code}:${entry.card.slug}`)
        .join(", ")}`,
    );
  }
}
