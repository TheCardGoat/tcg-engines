import type { FabHeuristicCard } from "../types.ts";

export function cardKey(card: FabHeuristicCard): string {
  return `${card.name} ${card.canonicalId}`.toLowerCase();
}

export function named(card: FabHeuristicCard, ...needles: readonly string[]): boolean {
  const key = cardKey(card);
  return needles.some((needle) => key.includes(needle.toLowerCase()));
}

export function isBloodrush(card: FabHeuristicCard): boolean {
  return named(card, "bloodrush");
}

export function isBeastWithin(card: FabHeuristicCard): boolean {
  return named(card, "beast within", "beast-within");
}

export function isWildRide(card: FabHeuristicCard): boolean {
  return named(card, "wild ride", "wild-ride");
}

export function isBareDestruction(card: FabHeuristicCard): boolean {
  return named(card, "bare destruction", "bare-destruction");
}

export function isTearLimb(card: FabHeuristicCard): boolean {
  return named(card, "tear limb", "tear-limb");
}

export function isSavageFeast(card: FabHeuristicCard): boolean {
  return named(card, "savage feast", "savage-feast");
}

export function isPremiumRedThreat(card: FabHeuristicCard): boolean {
  return named(card, "swing big", "swing-big", "show of strength", "show-of-strength");
}

export function isDisruption(card: FabHeuristicCard): boolean {
  return named(
    card,
    "send packing",
    "send-packing",
    "strongest survive",
    "strongest-survive",
    "splatter skull",
    "splatter-skull",
    "command and conquer",
    "command-and-conquer",
  );
}

export function isSmashback(card: FabHeuristicCard): boolean {
  return named(card, "smashback");
}

export function isSavageSash(card: FabHeuristicCard): boolean {
  return named(card, "savage sash", "savage-sash");
}

export function isMandibleClaw(card: FabHeuristicCard): boolean {
  return named(card, "mandible");
}

export function isScabskin(card: FabHeuristicCard): boolean {
  return named(card, "scabskin");
}

export function isBlueFivePower(card: FabHeuristicCard): boolean {
  return card.pitch === 3 && card.power === 5 && card.isAttack;
}

export function isPower6Fuel(card: FabHeuristicCard): boolean {
  return card.power >= 6 || isBeastWithin(card);
}

export function isRhinarHero(snapshot: {
  heroCanonicalId: string | null;
  heroName: string;
}): boolean {
  const blob = `${snapshot.heroName} ${snapshot.heroCanonicalId ?? ""}`.toLowerCase();
  return blob.includes("rhinar");
}

export function isTuffnutHero(snapshot: {
  heroCanonicalId: string | null;
  heroName: string;
}): boolean {
  const blob = `${snapshot.heroName} ${snapshot.heroCanonicalId ?? ""}`.toLowerCase();
  return (
    blob.includes("tuffnut") ||
    snapshot.heroCanonicalId === "wqmMJj8PqzNHg7Q7LMqTR" ||
    snapshot.heroCanonicalId === "wKnhnNTHKHqFfjgdn9LLP"
  );
}

export function isTuffnut(card: FabHeuristicCard): boolean {
  return (
    named(card, "tuffnut") ||
    card.canonicalId === "wqmMJj8PqzNHg7Q7LMqTR" ||
    card.canonicalId === "wKnhnNTHKHqFfjgdn9LLP"
  );
}

export function isDigIn(card: FabHeuristicCard): boolean {
  return (
    named(card, "dig in", "dig-in") ||
    card.canonicalId === "gncL7pDCJzDJffqCnGGQM" ||
    card.canonicalId === "RhkhMcbkCpRhLmpfqmbDF" ||
    card.canonicalId === "8TmrQnhqFHDGkCQGKzWTj"
  );
}

export function isTeklovossenHero(snapshot: {
  heroCanonicalId: string | null;
  heroName: string;
}): boolean {
  const blob = `${snapshot.heroName} ${snapshot.heroCanonicalId ?? ""}`.toLowerCase();
  return blob.includes("teklovossen");
}

export function isEvo(card: FabHeuristicCard): boolean {
  return card.subtypes.includes("Evo") || named(card, "evo ", "evo-");
}

export function isBetaBase(card: FabHeuristicCard): boolean {
  return isEvo(card) && named(card, "beta base", "beta-base");
}

export function isSteelSoul(card: FabHeuristicCard): boolean {
  return isEvo(card) && named(card, "steel soul", "steel-soul");
}

export type FabEvoSlot = "head" | "chest" | "arms" | "legs";

export function evoSlot(card: FabHeuristicCard): FabEvoSlot | null {
  if (named(card, "memory", "base head", "base-head")) return "head";
  if (named(card, "processor", "base chest", "base-chest")) return "chest";
  if (named(card, "controller", "base arms", "base-arms")) return "arms";
  if (named(card, "tower", "base legs", "base-legs")) return "legs";
  return null;
}

export function isBoostAttack(card: FabHeuristicCard): boolean {
  return named(
    card,
    "zero to sixty",
    "zero-to-sixty",
    "zipper hit",
    "zipper-hit",
    "twin drive",
    "twin-drive",
    "t-bone",
    "t bone",
    "sprocket rocket",
    "sprocket-rocket",
    "heavy metal hardcore",
    "heavy-metal-hardcore",
    "throttle",
    "blast rig",
    "blast-rig",
  );
}

export function isTwinDrive(card: FabHeuristicCard): boolean {
  return named(card, "twin drive", "twin-drive");
}

export function isFabricate(card: FabHeuristicCard): boolean {
  return named(card, "fabricate");
}

export function isHaymaker(card: FabHeuristicCard): boolean {
  return named(
    card,
    "terminator tank",
    "terminator-tank",
    "war machine",
    "war-machine",
    "blast rig",
    "blast-rig",
    "singularity",
    "maximum velocity",
    "maximum-velocity",
  );
}

export function isSingularityOrRecall(card: FabHeuristicCard): boolean {
  return named(card, "singularity", "evo recall", "evo-recall");
}

export function isFirewall(card: FabHeuristicCard): boolean {
  return named(card, "firewall");
}

export function isArakniHero(snapshot: {
  heroCanonicalId: string | null;
  heroName: string;
}): boolean {
  const blob = `${snapshot.heroName} ${snapshot.heroCanonicalId ?? ""}`.toLowerCase();
  return blob.includes("arakni");
}

export function isHunterKlaive(card: FabHeuristicCard): boolean {
  return named(card, "klaive");
}

export function isChelicera(card: FabHeuristicCard): boolean {
  return named(card, "chelicera");
}

export function isFlickKnives(card: FabHeuristicCard): boolean {
  return named(card, "flick knives", "flick-knives");
}

export function isMaskOfDeceit(card: FabHeuristicCard): boolean {
  return named(card, "mask of deceit", "mask-of-deceit");
}

export function isStealthFinisher(card: FabHeuristicCard): boolean {
  return (
    card.hasStealth ||
    named(
      card,
      "mark of the black widow",
      "black-widow",
      "meet madness",
      "meet-madness",
      "kiss of death",
      "kiss-of-death",
      "leave no witnesses",
      "leave-no-witnesses",
      "death touch",
      "death-touch",
      "art of desire",
      "art-of-desire",
    )
  );
}

export function isDaggerPump(card: FabHeuristicCard): boolean {
  return named(
    card,
    "savor bloodshed",
    "savor-bloodshed",
    "tarantula toxin",
    "tarantula-toxin",
    "up sticks",
    "up-sticks",
    "cut from the same cloth",
    "cut-from-the-same",
    "stains of the redback",
    "stains-of-the-redback",
    "to the point",
    "to-the-point",
    "scar tissue",
    "scar-tissue",
  );
}

export function isTarantulaToxin(card: FabHeuristicCard): boolean {
  return named(card, "tarantula toxin", "tarantula-toxin");
}

export function isAssassinTrap(card: FabHeuristicCard): boolean {
  return named(card, "trap") && !named(card, "trap-door", "trap door");
}

export function isValdaHero(snapshot: {
  heroCanonicalId: string | null;
  heroName: string;
}): boolean {
  const blob = `${snapshot.heroName} ${snapshot.heroCanonicalId ?? ""}`.toLowerCase();
  return blob.includes("valda");
}

export function isCrushHaymaker(card: FabHeuristicCard): boolean {
  return named(
    card,
    "spinal crush",
    "spinal-crush",
    "boulder drop",
    "boulder-drop",
    "disable",
    "put 'em in their place",
    "put-em-in-their-place",
    "disenchantment",
    "tear asunder",
    "tear-asunder",
    "cranial crush",
    "cranial-crush",
  );
}

export function isSeismicEruption(card: FabHeuristicCard): boolean {
  return named(card, "seismic eruption", "seismic-eruption");
}

export function isLeyLine(card: FabHeuristicCard): boolean {
  return named(card, "ley line", "ley-line");
}

export function isPummel(card: FabHeuristicCard): boolean {
  return named(card, "pummel");
}

export function isTectonicPlating(card: FabHeuristicCard): boolean {
  return named(card, "tectonic plating", "tectonic-plating");
}

export function isBasaltBoots(card: FabHeuristicCard): boolean {
  return named(card, "basalt boots", "basalt-boots");
}

export function isTestament(card: FabHeuristicCard): boolean {
  return named(card, "testament");
}

export function isCivicPeak(card: FabHeuristicCard): boolean {
  return named(card, "civic peak", "civic-peak");
}

export function isAuroraHero(snapshot: {
  heroCanonicalId: string | null;
  heroName: string;
}): boolean {
  const blob = `${snapshot.heroName} ${snapshot.heroCanonicalId ?? ""}`.toLowerCase();
  return blob.includes("aurora");
}

export function isScorpio(card: FabHeuristicCard): boolean {
  return named(card, "scorpio");
}

export function isLightningGoAgainAttack(card: FabHeuristicCard): boolean {
  return named(
    card,
    "lightning surge",
    "lightning-surge",
    "fry",
    "flittering charge",
    "flittering-charge",
    "second strike",
    "second-strike",
    "path of same ends",
    "path-of-same-ends",
  );
}

export function isQuickstrikeAttack(card: FabHeuristicCard): boolean {
  return named(
    card,
    "rush of power",
    "rush-of-power",
    "prophetic quickstep",
    "prophetic-quickstep",
    "dashing flashfoot",
    "dashing-flashfoot",
  );
}

export function isGoneInAFlash(card: FabHeuristicCard): boolean {
  return named(card, "gone in a flash", "gone-in-a-flash");
}

export function isFry(card: FabHeuristicCard): boolean {
  return named(card, "fry");
}

export function isLightningSurge(card: FabHeuristicCard): boolean {
  return named(card, "lightning surge", "lightning-surge");
}

export function isQuickSuccession(card: FabHeuristicCard): boolean {
  return named(card, "quick succession", "quick-succession");
}

export function isFlowGenerator(card: FabHeuristicCard): boolean {
  return named(card, "flowstate", "flowing stormstrike", "flowing-stormstrike");
}

export function isLightningInstant(card: FabHeuristicCard): boolean {
  return named(
    card,
    "electrostatic",
    "sigil of lightning",
    "sigil-of-lightning",
    "lightning press",
    "lightning-press",
    "sigil of solace",
    "sigil-of-solace",
  );
}

export function isLightningGreaves(card: FabHeuristicCard): boolean {
  return named(card, "lightning greaves", "lightning-greaves");
}

export function isFacePurgatory(card: FabHeuristicCard): boolean {
  return named(card, "face purgatory", "face-purgatory");
}

export function isOminousExcavation(card: FabHeuristicCard): boolean {
  return named(card, "ominous excavation", "ominous-excavation");
}

export function isLightningArsenal(card: FabHeuristicCard): boolean {
  return isFry(card) || isLightningSurge(card);
}

export function isRedlineFinisher(card: FabHeuristicCard): boolean {
  return named(card, "snatch");
}

export function isLightningFlow(card: FabHeuristicCard): boolean {
  return named(card, "lightning flow", "lightning-flow");
}

export function isEmbodimentOfLightning(card: FabHeuristicCard): boolean {
  return named(card, "embodiment of lightning", "embodiment-of-lightning");
}

/** Full printed hero identity — "Arakni Marionette" ≠ "Arakni Huntsman". */
export function heroMirrorKey(name: string, canonicalId: string | null): string {
  const printed = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  if (printed.length > 0) return printed;
  return (canonicalId ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function isOscilioHero(snapshot: {
  heroCanonicalId: string | null;
  heroName: string;
}): boolean {
  const blob = `${snapshot.heroName} ${snapshot.heroCanonicalId ?? ""}`.toLowerCase();
  return blob.includes("oscilio");
}

export function isZyggyHero(snapshot: {
  heroCanonicalId: string | null;
  heroName: string;
}): boolean {
  const blob = `${snapshot.heroName} ${snapshot.heroCanonicalId ?? ""}`.toLowerCase();
  return blob.includes("zyggy");
}

export function isVolatileFluxor(card: FabHeuristicCard): boolean {
  return named(card, "volatile fluxor", "volatile-fluxor");
}

export function isOscilioFlowAttack(card: FabHeuristicCard): boolean {
  return isVolatileFluxor(card) || named(card, "flowing stormstrike", "flowing-stormstrike");
}

export function isOscilioFlowSpell(card: FabHeuristicCard): boolean {
  return named(
    card,
    "enion surge",
    "enion-surge",
    "lightning overload",
    "lightning-overload",
    "constella flowslide",
    "constella-flowslide",
  );
}

export function isAstralStrike(card: FabHeuristicCard): boolean {
  return named(card, "astral strike", "astral-strike");
}

export function isVolzar(card: FabHeuristicCard): boolean {
  return named(card, "volzar");
}

export function isPonder(card: FabHeuristicCard): boolean {
  return named(card, "ponder") && !named(card, "tome of quandaries");
}

export function isIllusionistAura(card: FabHeuristicCard): boolean {
  return (
    card.subtypes.includes("Aura") ||
    card.types.includes("Aura") ||
    named(
      card,
      "nebulus",
      "crackle from afar",
      "crackle-from-afar",
      "fleeing starbreeze",
      "fleeing-starbreeze",
      "nourishing glow",
      "nourishing-glow",
      "haze bending",
      "haze-bending",
      "spectral shield",
      "spectral-shield",
    )
  );
}

export function isPhantasmaclasm(card: FabHeuristicCard): boolean {
  return named(card, "phantasmaclasm");
}

export function isRealityRefractor(card: FabHeuristicCard): boolean {
  return named(card, "reality refractor", "reality-refractor");
}

export function isIrisOfReality(card: FabHeuristicCard): boolean {
  return named(card, "iris of reality", "iris-of-reality");
}

export function isAstralEtchings(card: FabHeuristicCard): boolean {
  return named(card, "astral etchings", "astral-etchings");
}

export function isGravyHero(snapshot: {
  heroCanonicalId: string | null;
  heroName: string;
}): boolean {
  const blob = `${snapshot.heroName} ${snapshot.heroCanonicalId ?? ""}`.toLowerCase();
  return blob.includes("gravy");
}

export function isGoAgainPirate(card: FabHeuristicCard): boolean {
  return named(
    card,
    "saltwater swell",
    "saltwater-swell",
    "golden tipple",
    "golden-tipple",
    "swiftwater sloop",
    "swiftwater-sloop",
    "conqueror of the high seas",
    "conqueror-of-the-high-seas",
  );
}

export function isGravyAllyFinisher(card: FabHeuristicCard): boolean {
  return named(
    card,
    "riggermortis",
    "sawbones",
    "limpit",
    "chum",
    "friendly first mate",
    "friendly-first-mate",
  );
}

export function isWateryGraveCard(card: FabHeuristicCard): boolean {
  return (
    card.hasWateryGrave ||
    isGravyAllyFinisher(card) ||
    named(card, "jittery bones", "jittery-bones", "anka")
  );
}

export function isBlueWateryGraveEnabler(card: FabHeuristicCard): boolean {
  return named(
    card,
    "give no quarter",
    "give-no-quarter",
    "chart the high seas",
    "chart-the-high-seas",
    "chart a course",
    "chart-a-course",
    "murderous rabble",
    "murderous-rabble",
    "loot the hold",
    "loot-the-hold",
    "call to the grave",
    "call-to-the-grave",
    "avast ye",
    "avast-ye",
    "tip the barkeep",
    "tip-the-barkeep",
    "sea legs",
    "sea-legs",
  );
}

export function isCompassOfSunkenDepths(card: FabHeuristicCard): boolean {
  return named(card, "compass of sunken depths", "compass-of-sunken-depths");
}

export function isCrownOfDominion(card: FabHeuristicCard): boolean {
  return named(card, "crown of dominion", "crown-of-dominion");
}

export function isDeadThreads(card: FabHeuristicCard): boolean {
  return named(card, "dead threads", "dead-threads");
}

export function isGoldBaitedHook(card: FabHeuristicCard): boolean {
  return named(card, "gold-baited hook", "gold baited hook", "gold-baited-hook");
}

export function isMageMasterBoots(card: FabHeuristicCard): boolean {
  return named(card, "mage master boots", "mage-master-boots");
}

export function isGoldToken(card: FabHeuristicCard): boolean {
  return card.name.trim().toLowerCase() === "gold";
}

export function isMarlynnHero(snapshot: {
  heroCanonicalId: string | null;
  heroName: string;
}): boolean {
  const blob = `${snapshot.heroName} ${snapshot.heroCanonicalId ?? ""}`.toLowerCase();
  return blob.includes("marlynn");
}

export function isPuffinHero(snapshot: {
  heroCanonicalId: string | null;
  heroName: string;
}): boolean {
  const blob = `${snapshot.heroName} ${snapshot.heroCanonicalId ?? ""}`.toLowerCase();
  return blob.includes("puffin");
}

export function isPleiadesHero(snapshot: {
  heroCanonicalId: string | null;
  heroName: string;
}): boolean {
  const blob = `${snapshot.heroName} ${snapshot.heroCanonicalId ?? ""}`.toLowerCase();
  return blob.includes("pleiades");
}

/** Kayo, Underhanded Cheat — not Kayo, Armed and Dangerous. */
export function isKayoHero(snapshot: {
  heroCanonicalId: string | null;
  heroName: string;
}): boolean {
  const blob = `${snapshot.heroName} ${snapshot.heroCanonicalId ?? ""}`.toLowerCase();
  if (blob.includes("armed and dangerous") || blob.includes("armed-and-dangerous")) return false;
  return blob.includes("kayo");
}

export function isLyathHero(snapshot: {
  heroCanonicalId: string | null;
  heroName: string;
}): boolean {
  const blob = `${snapshot.heroName} ${snapshot.heroCanonicalId ?? ""}`.toLowerCase();
  return blob.includes("lyath");
}

/**
 * Malice, Domina of the Dead — not the young "Malice" hero, which shares the
 * printed first name (and the same activated ability text).
 */
export function isMaliceHero(snapshot: {
  heroCanonicalId: string | null;
  heroName: string;
}): boolean {
  const blob = `${snapshot.heroName} ${snapshot.heroCanonicalId ?? ""}`.toLowerCase();
  if (!blob.includes("malice")) return false;
  return snapshot.heroCanonicalId !== "rrJg7Bntjp9WzWNcnJcjw";
}

/** Zombie-typed cards (Restless allies, Corrupted Corpse tokens). */
export function isZombieCard(card: FabHeuristicCard): boolean {
  return card.subtypes.includes("Zombie");
}

export function isRestlessAlly(card: FabHeuristicCard): boolean {
  return isZombieCard(card) && named(card, "restless");
}

export function isCorruptedCorpse(card: FabHeuristicCard): boolean {
  return named(card, "corrupted corpse", "corrupted-corpse");
}

export function isVoxNecropolis(card: FabHeuristicCard): boolean {
  return named(card, "vox necropolis", "vox-necropolis");
}

export function isUndeadGrasp(card: FabHeuristicCard): boolean {
  return named(card, "undead grasp", "undead-grasp");
}

export function isCarrionCrown(card: FabHeuristicCard): boolean {
  return named(card, "carrion crown", "carrion-crown");
}

export function isGateToIArathael(card: FabHeuristicCard): boolean {
  return named(card, "gate to i'arathael", "gate-to-i-arathael", "gate to i arathael");
}

export function isInvertExistence(card: FabHeuristicCard): boolean {
  return named(card, "invert existence", "invert-existence");
}

export function isBoneBarrier(card: FabHeuristicCard): boolean {
  return named(card, "bone barrier", "bone-barrier");
}

export function isOminousToll(card: FabHeuristicCard): boolean {
  return named(card, "ominous toll", "ominous-toll");
}

export function isSkeletalPuppetry(card: FabHeuristicCard): boolean {
  return named(card, "skeletal puppetry", "skeletal-puppetry");
}

export function isTomeOfNecrosis(card: FabHeuristicCard): boolean {
  return named(card, "tome of necrosis", "tome-of-necrosis");
}

export function isCallToTheGrave(card: FabHeuristicCard): boolean {
  return named(card, "call to the grave", "call-to-the-grave");
}

export function isDigForSouls(card: FabHeuristicCard): boolean {
  return named(card, "dig for souls", "dig-for-souls");
}

export function isBondedBurial(card: FabHeuristicCard): boolean {
  return named(card, "bonded burial", "bonded-burial");
}

export function isForsakenStrike(card: FabHeuristicCard): boolean {
  return named(card, "forsaken strike", "forsaken-strike");
}

export function isShadowrealmPump(card: FabHeuristicCard): boolean {
  return (
    named(card, "shadowrealm strength", "shadowrealm-strength") ||
    named(card, "shadowrealm swiftness", "shadowrealm-swiftness")
  );
}

export function isMaliceMark(card: FabHeuristicCard): boolean {
  return (
    named(card, "mark of neverest", "mark-of-neverest") ||
    named(card, "mark of ushering", "mark-of-ushering")
  );
}

export function isHarpoon(card: FabHeuristicCard): boolean {
  return (
    card.subtypes.includes("Arrow") ||
    named(
      card,
      "harpoon",
      "king shark",
      "king-shark",
      "king kraken",
      "king-kraken",
      "blue fin",
      "blue-fin",
      "yellow fin",
      "yellow-fin",
      "red fin",
      "red-fin",
      "goldfin",
      "endless arrow",
      "endless-arrow",
    )
  );
}

export function isMarlynnPump(card: FabHeuristicCard): boolean {
  return named(
    card,
    "take aim",
    "take-aim",
    "gold the tip",
    "gold-the-tip",
    "big game trophy",
    "big-game-trophy",
    "lace with bloodrot",
    "lace-with-bloodrot",
    "seek and destroy",
    "seek-and-destroy",
  );
}

export function isCodexOfFrailty(card: FabHeuristicCard): boolean {
  return named(card, "codex of frailty", "codex-of-frailty");
}

export function isCogInTheMachine(card: FabHeuristicCard): boolean {
  return named(card, "cog in the machine", "cog-in-the-machine");
}

export function isPuffinCrankItem(card: FabHeuristicCard): boolean {
  return named(
    card,
    "cogwerx workshop",
    "cogwerx-workshop",
    "copper cog",
    "copper-cog",
    "polly cranka",
    "polly-cranka",
    "golden cog",
    "golden-cog",
  );
}

export function isPuffinOnHit(card: FabHeuristicCard): boolean {
  return named(
    card,
    "palantir aeronought",
    "palantir-aeronought",
    "cogwerx zeppelin",
    "cogwerx-zeppelin",
    "conqueror of the high seas",
    "conqueror-of-the-high-seas",
    "command and conquer",
    "command-and-conquer",
  );
}

export function isPuffinSmallAttack(card: FabHeuristicCard): boolean {
  return named(card, "soup up", "soup-up", "cogwerx dovetail", "cogwerx-dovetail", "spitfire");
}

export function isWhatHappensNext(card: FabHeuristicCard): boolean {
  return named(card, "what happens next", "what-happens-next");
}

export function isSuspenseAura(card: FabHeuristicCard): boolean {
  return (
    isWhatHappensNext(card) ||
    named(
      card,
      "act of glory",
      "act-of-glory",
      "edge of their seats",
      "edge-of-their-seats",
      "tension in the air",
      "tension-in-the-air",
      "the suspense is killing me",
      "suspense-is-killing",
      "imposing visage",
      "imposing-visage",
      "in the palm of your hand",
      "in-the-palm",
      "up on a pedestal",
      "up-on-a-pedestal",
      "superstar",
    )
  );
}

export function isPleiadesHaymaker(card: FabHeuristicCard): boolean {
  return named(
    card,
    "cries of encore",
    "cries-of-encore",
    "boulder drop",
    "boulder-drop",
    "command and conquer",
    "command-and-conquer",
    "thump",
  );
}

export function isThespianCharm(card: FabHeuristicCard): boolean {
  return named(card, "thespian charm", "thespian-charm");
}

export function isBigBully(card: FabHeuristicCard): boolean {
  return named(card, "big bully", "big-bully");
}

export function isMockingBlow(card: FabHeuristicCard): boolean {
  return named(card, "mocking blow", "mocking-blow");
}

export function isNimby(card: FabHeuristicCard): boolean {
  return named(card, "nimby") && !named(card, "nimblism");
}

export function isLookingForAScrap(card: FabHeuristicCard): boolean {
  return named(card, "looking for a scrap", "looking-for-a-scrap");
}

export function isOutsideInterference(card: FabHeuristicCard): boolean {
  return named(card, "outside interference", "outside-interference");
}

export function isLyathPump(card: FabHeuristicCard): boolean {
  return named(
    card,
    "cruel ambition",
    "cruel-ambition",
    "two steps ahead",
    "two-steps-ahead",
    "sadistic scowl",
    "sadistic-scowl",
    "escalate violence",
    "escalate-violence",
  );
}

export function isShortShrift(card: FabHeuristicCard): boolean {
  return named(card, "short shrift", "short-shrift");
}

export function isTearAsunder(card: FabHeuristicCard): boolean {
  return named(card, "tear asunder", "tear-asunder");
}

export function isTitansFist(card: FabHeuristicCard): boolean {
  return named(card, "titan's fist", "titans fist", "titan-s-fist", "titans-fist");
}

export function isVigorToken(card: FabHeuristicCard): boolean {
  return card.name.trim().toLowerCase() === "vigor";
}

export function isMirrorDisruption(card: FabHeuristicCard): boolean {
  return named(
    card,
    "command and conquer",
    "command-and-conquer",
    "weakest link",
    "weakest-link",
    "send packing",
    "send-packing",
    "breaking point",
    "breaking-point",
    "art of the dragon",
    "art-of-the-dragon",
    "tick tock",
    "tick-tock",
    "blunten",
    "sunken treasure",
    "sunken-treasure",
    "temporal wobble",
    "temporal-wobble",
  );
}

/**
 * Viserai, the Forsaken (IAR106) — not the other Viserai printings.
 *
 * Traverse (3+ Runechants created in one turn) flips this twin card's active
 * face to "Viserai, Usurper" while the object keeps its canonical identity, so
 * match the canonical id first. The Between Worlds twin flips to the same face
 * name but keeps its own canonical id, and the standalone "Viserai, Usurper"
 * hero has a different id — neither may match.
 */
export function isViseraiForsakenHero(snapshot: {
  heroCanonicalId: string | null;
  heroName: string;
}): boolean {
  if (snapshot.heroCanonicalId === "RLJggjWTcq6NK9PD9zQGh") return true;
  const blob = snapshot.heroName.toLowerCase();
  return blob.includes("viserai") && blob.includes("forsaken");
}

export function isGloomblade(card: FabHeuristicCard): boolean {
  return named(card, "gloomblade");
}

/** Any arena aura — Usurp fuel and the hero's Runechant-trigger counter. */
export function isAuraPermanent(card: FabHeuristicCard): boolean {
  return card.subtypes.includes("Aura") || card.types.includes("Aura");
}

export function isRunechantAura(card: FabHeuristicCard): boolean {
  return isAuraPermanent(card) && named(card, "runechant");
}

export function isEmbraceUrsur(card: FabHeuristicCard): boolean {
  return named(card, "embrace ursur", "embrace-ursur");
}

export function isRuneragerSwarm(card: FabHeuristicCard): boolean {
  return named(card, "runerager");
}

export function isBecomeTheShadowLord(card: FabHeuristicCard): boolean {
  return named(card, "become the shadow lord", "become-the-shadow-lord");
}

export function isDeadwoodDirge(card: FabHeuristicCard): boolean {
  return named(card, "deadwood dirge", "deadwood-dirge");
}

export function isRevelInRuneblood(card: FabHeuristicCard): boolean {
  return named(card, "revel in runeblood", "revel-in-runeblood");
}

/** Malefic Incantation / Runeblood Incantation — go-again Runechant auras. */
export function isRunechantIncantation(card: FabHeuristicCard): boolean {
  return named(
    card,
    "malefic incantation",
    "malefic-incantation",
    "runeblood incantation",
    "runeblood-incantation",
  );
}

export function isSevenSinNebula(card: FabHeuristicCard): boolean {
  return named(card, "seven sin nebula", "seven-sin-nebula");
}

export function isShadowPuppetry(card: FabHeuristicCard): boolean {
  return named(card, "shadow puppetry", "shadow-puppetry");
}

/** Captain's Call — +2{p} or go-again mode pump for the next cheap attack. */
export function isCaptainsCall(card: FabHeuristicCard): boolean {
  return named(card, "captain's call", "captains-call", "captain-s-call");
}

export function isPainfulPassage(card: FabHeuristicCard): boolean {
  return named(card, "painful passage", "painful-passage");
}

export function isGoreBelching(card: FabHeuristicCard): boolean {
  return named(card, "gore belching", "gore-belching");
}
