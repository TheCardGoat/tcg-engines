/**
 * Visual **text** fixtures for FAB hero-special UI validation.
 *
 * Each fixture is an ASCII playmat snapshot a UX engineer can treat as an
 * acceptance target: if the real UI does not surface every labeled region /
 * badge / stack, the fixture fails review.
 *
 * These are intentionally presentation-only (not engine-backed) so they can
 * ship before every special system exists in the rules engine.
 */

import {
  HERO_SPECIAL_UI_CATALOG,
  type FabHeroSpecialUiRequirement,
  listHeroesWithTextFixtures,
} from "./catalog";
import { getFabUiModule, type FabUiModuleId } from "./modules";

export interface FabHeroTextFixture {
  readonly id: string;
  readonly hero: string;
  readonly tier: "A" | "B" | "C";
  readonly mustShow: readonly string[];
  readonly modules: readonly FabUiModuleId[];
  /** Full ASCII board used for visual review and snapshot tests. */
  readonly board: string;
  /** One-line summary for catalog indexes. */
  readonly summary: string;
}

function pad(label: string, width = 62): string {
  if (label.length >= width) return label.slice(0, width);
  return label + " ".repeat(width - label.length);
}

function box(title: string, lines: readonly string[]): string {
  const width = 62;
  const top = `┌─ ${title} ${"─".repeat(Math.max(0, width - title.length - 3))}┐`;
  const bottom = `└${"─".repeat(width)}┘`;
  const body = lines.map((line) => `│ ${pad(line, width - 2)} │`);
  return [top, ...body, bottom].join("\n");
}

function modulesBlock(modules: readonly FabUiModuleId[]): string {
  return modules
    .map((id) => {
      const mod = getFabUiModule(id);
      return `  • ${mod.label} — ${mod.summary}`;
    })
    .join("\n");
}

function mustShowBlock(mustShow: readonly string[]): string {
  return mustShow.map((line, i) => `  ${i + 1}. ${line}`).join("\n");
}

/** Generic playmat shell used by most fixtures; `fill` injects special rows. */
function playmat(args: {
  heroName: string;
  life: number;
  resources: number;
  ap: number;
  chi?: number | null;
  soul?: string;
  heroCounters?: string;
  statuses?: readonly string[];
  weapons?: string;
  equipment?: string;
  permanents?: readonly string[];
  banished?: readonly string[];
  inventory?: readonly string[];
  arsenal?: string;
  pitch?: string;
  graveyard?: string;
  hand?: string;
  extra?: readonly string[];
}): string {
  const assetBits = [
    `Life ${args.life}`,
    `Resources ${args.resources}`,
    `AP ${args.ap}`,
    args.chi != null && args.chi !== undefined ? `Chi ${args.chi}` : "Chi —",
  ].join("  │  ");

  const statusLine =
    args.statuses && args.statuses.length > 0
      ? args.statuses.map((s) => `[${s}]`).join(" ")
      : "[no special flags]";

  const permanentLines =
    args.permanents && args.permanents.length > 0 ? args.permanents : ["(empty permanent zone)"];
  const banishedLines = args.banished && args.banished.length > 0 ? args.banished : ["(empty)"];

  const sections: string[] = [
    box("ASSETS (public)", [assetBits]),
    box("HERO CLUSTER", [
      "              [Head]",
      `${args.weapons ?? "[W1] [W2]"}   [${args.heroName}]   [Chest]`,
      `                 soul: ${args.soul ?? "—"}`,
      args.heroCounters
        ? `              counters: ${args.heroCounters}`
        : "              counters: —",
      "                 [Arms]",
      "                 [Legs]",
      `equip: ${args.equipment ?? "standard gear (not special)"}`,
      `status: ${statusLine}`,
    ]),
    box("PERMANENTS / TOKENS", permanentLines),
    box("BANISHED", banishedLines),
  ];

  if (args.inventory && args.inventory.length > 0) {
    sections.push(box("INVENTORY", args.inventory));
  }

  sections.push(
    box("PILES", [
      `Arsenal: ${args.arsenal ?? "(empty / face-down)"}`,
      `Pitch:   ${args.pitch ?? "(empty)"}`,
      `GY:      ${args.graveyard ?? "(empty)"}`,
      `Hand:    ${args.hand ?? "4 cards (private)"}`,
    ]),
  );

  if (args.extra && args.extra.length > 0) {
    sections.push(box("EXTRA / FORMAT", args.extra));
  }

  return sections.join("\n");
}

type BoardBuilder = (hero: FabHeroSpecialUiRequirement) => string;

const BOARD_BUILDERS: Record<string, BoardBuilder> = {
  dromai: () =>
    playmat({
      heroName: "Dromai",
      life: 32,
      resources: 1,
      ap: 1,
      statuses: ["played-red-this-turn"],
      permanents: [
        "Ash ×3                          (token stack)",
        "Aether Ashwing  1{p}/1{h}        under: Ash ×1  [phantasm]",
        "Azvolai         6{p}/6{h}        under: Ash ×2  [phantasm][attacking?]",
        "← dragons are full ally cards; ash under them is material",
      ],
      pitch: "red card (just pitched → created Ash)",
      hand: "Invocation + red pitch fuel",
    }),

  levia: () =>
    playmat({
      heroName: "Levia",
      life: 28,
      resources: 0,
      ap: 1,
      statuses: ["6+p-entered-banished-this-turn → blood-debt MITIGATED"],
      permanents: ["(no signature tokens — banished is the economy)"],
      banished: [
        "Blood Debt pending life loss: 4   ← count of public BD cards",
        "• Endless Winter (BD)  {p}6+",
        "• Mark of the Beast (BD)",
        "• Soul Food (BD)",
        "• Wrecker Romp (BD)",
        "UI: show BD badge per card + aggregate end-phase −{h}",
      ],
      graveyard: "discarded non-BD cards",
      hand: "6+{p} brute attacks",
    }),

  chane: () =>
    playmat({
      heroName: "Chane",
      life: 30,
      resources: 2,
      ap: 1,
      statuses: ["soul-shackle-armed-this-turn?"],
      permanents: [
        "Soul Shackle ×2   (each: banish top at action phase)",
        "Runechant ×3      (from package / flails)",
      ],
      banished: [
        "Blood Debt pending: 3",
        "• Seeds of Agony (BD) — Rune Gate candidate",
        "• Dimenxxional Gateway (BD)",
        "• top-deck exile from shackles",
      ],
    }),

  vynnset: () =>
    playmat({
      heroName: "Vynnset",
      life: 34,
      resources: 0,
      ap: 1,
      statuses: ["start-turn-banished-hand", "runechant-unpreventable?"],
      permanents: ["Runechant ×4"],
      banished: [
        "Blood Debt pending: 2",
        "• hand card banished at start of turn",
        "• shadow non-attack",
      ],
    }),

  boltyn: () =>
    playmat({
      heroName: "Boltyn",
      life: 36,
      resources: 1,
      ap: 1,
      soul: "3 cards (Censor / Courage / charge fuel)",
      statuses: ["charged-this-turn"],
      weapons: "[Dawnblade]",
      permanents: ["Courage ×1 (optional package)"],
      banished: ["(soul cards leave to banished when spent)"],
    }),

  "prism-sculptor": () =>
    playmat({
      heroName: "Prism",
      life: 35,
      resources: 2,
      ap: 1,
      soul: "4 (Herald light cards)",
      permanents: ["Spectral Shield ×2   Ward 1 each"],
      banished: ["soul card spent to create shield"],
    }),

  "prism-awakener": () =>
    playmat({
      heroName: "Prism (Awakener)",
      life: 33,
      resources: 2,
      ap: 1,
      soul: "2 Heralds",
      permanents: [
        "Figment of Triumph   (unawakened)",
        "Figment of Tenacity  (awakened → angel ally)",
        "Spectral Shield ×1",
      ],
      banished: ["soul card spent to Awaken"],
    }),

  nuu: () =>
    playmat({
      heroName: "Nuu",
      life: 32,
      resources: 0,
      ap: 1,
      chi: 3,
      statuses: ["chi ready for {c}{c}{c}"],
      permanents: ["(stealth attacks / no signature token)"],
      banished: [
        "OPPONENT banished (viewer can highlight playable blues):",
        "• blue action (playable by Nuu this turn?)",
        "OWN banished: defending actions from resolved links",
      ],
      hand: "blue steal package",
    }),

  enigma: () =>
    playmat({
      heroName: "Enigma",
      life: 34,
      resources: 1,
      ap: 1,
      chi: 2,
      equipment: "cloaked face-down equip ×2 (New Moon) + face-up ward piece",
      permanents: [
        "Spectral Shield ×3   one has +1{p} counter",
        "Spectral Shield can attack (first costs {r} less)",
      ],
    }),

  zen: () =>
    playmat({
      heroName: "Zen",
      life: 31,
      resources: 0,
      ap: 1,
      chi: 3,
      permanents: ["(combo board — tokens optional)"],
      banished: ["• Flic Flak (combo) FACE-UP  [may play this turn]"],
      hand: "Crouching Tiger (created) + attacks",
    }),

  maxx: () =>
    playmat({
      heroName: "Maxx",
      life: 28,
      resources: 2,
      ap: 1,
      statuses: ["boosted-this-turn", "cranked-this-turn ×1"],
      permanents: [
        "Hyper Driver   steam ●●  [crank]  (token/item)",
        "Hyper Driver   steam ●    [crank]",
        "UI: steam counters + destroy-at-zero + crank AP gain",
      ],
    }),

  dash: () =>
    playmat({
      heroName: "Dash I/O",
      life: 30,
      resources: 1,
      ap: 1,
      statuses: ["top-deck-peek: visible"],
      permanents: ["Teklo Foundry Heart (item, arena)", "Hyper Driver steam ●●"],
      pitch: "boost discards may feed banished items",
      extra: ["TOP OF DECK (always look): cheap Mechanologist item"],
    }),

  teklovossen: () =>
    playmat({
      heroName: "Teklovossen",
      life: 32,
      resources: 3,
      ap: 1,
      statuses: ["next-evo-as-instant"],
      permanents: ["Evo equip / construct in arena"],
      banished: [
        "• Evo Steel Soul Module   [PLAYABLE FROM BANISHED]",
        "• Evo Face Controller     [PLAYABLE FROM BANISHED]",
      ],
    }),

  "data-doll": () =>
    playmat({
      heroName: "Data Doll MKII",
      life: 16,
      resources: 1,
      ap: 1,
      permanents: ["Item cost ≤2 that entered from banished this turn"],
      banished: ["boosted items waiting / already moved to arena"],
    }),

  malice: () =>
    playmat({
      heroName: "Malice",
      life: 29,
      resources: 1,
      ap: 1,
      permanents: ["Zombie ally A  3{p}/2{h}", "Zombie ally B  4{p}/1{h}"],
      banished: ["• face-down (zombie that died)", "• Corrupted Corpse (created on death)"],
      graveyard: "zombie targets for reanimation window",
    }),

  "gravy-bones": () =>
    playmat({
      heroName: "Gravy Bones",
      life: 30,
      resources: 0,
      ap: 1,
      statuses: ["blue-entered-GY-this-turn → watery grave ON"],
      permanents: ["Gold ×2"],
      graveyard: "watery grave cards [PLAYABLE] while blue-GY flag on",
      hand: "blues + looter lines",
    }),

  viserai: () =>
    playmat({
      heroName: "Viserai",
      life: 34,
      resources: 1,
      ap: 1,
      permanents: [
        "Runechant ×6   ← count must be huge/readable",
        "Rune Gate cards care about this number",
      ],
    }),

  "viserai-forsaken": () =>
    playmat({
      heroName: "Viserai Forsaken",
      life: 28,
      resources: 0,
      ap: 1,
      statuses: ["runechants-created-this-turn: 3 → TRAVERSE ready"],
      permanents: ["Runechant ×5"],
      banished: ["top-deck cards auto-exiled on Runechant create"],
    }),

  "viserai-usurper": () =>
    playmat({
      heroName: "Viserai Usurper",
      life: 30,
      resources: 1,
      ap: 1,
      statuses: ["gate-activated-this-turn → traverse EOT"],
      permanents: ["Gate to i'Arathael (landmark/permanent)"],
      banished: ["Blood Debt pending: 2  |  BD attacks package"],
    }),

  baalghor: () =>
    playmat({
      heroName: "Baalghor",
      life: 25,
      resources: 0,
      ap: 1,
      permanents: ["(pitch never stays — all pitch banishes)"],
      banished: ["• pitched cards (many)", "• attack actions [+3{p} when played from banished]"],
      pitch: "ALWAYS EMPTY (replacement: banish on pitch)",
    }),

  "arakni-chaos": () =>
    playmat({
      heroName: "Arakni Marionette",
      life: 32,
      resources: 1,
      ap: 1,
      statuses: ["opponent MARKED", "end-phase → Agent of Chaos roll"],
      permanents: ["(stealth / daggers)"],
      extra: ["OPPONENT hero badge: MARKED", "FORM: current moniker / pending Agent swap UI"],
    }),

  cindra: () =>
    playmat({
      heroName: "Cindra",
      life: 33,
      resources: 1,
      ap: 1,
      statuses: ["draconic-chain-links: 2", "opponent MARKED"],
      weapons: "[Dagger][Dagger]",
      permanents: ["Fealty ×2"],
      graveyard: "Draconic daggers [re-equip targets]",
    }),

  fang: () =>
    playmat({
      heroName: "Fang",
      life: 34,
      resources: 1,
      ap: 1,
      statuses: ["opponent MARKED", "fealty≥3? NO (2)"],
      weapons: "[Dagger][Dagger]",
      permanents: ["Fealty ×2   (need 3 for dagger discount)"],
    }),

  blaze: () =>
    playmat({
      heroName: "Blaze",
      life: 15,
      resources: 2,
      ap: 1,
      heroCounters: "energy ●●●●● (5)",
      statuses: ["opted-this-turn"],
      permanents: ["(arcane package — no required tokens)"],
    }),

  taylor: () =>
    playmat({
      heroName: "Taylor",
      life: 16,
      resources: 1,
      ap: 1,
      equipment: "currently equipped: arms piece A",
      inventory: [
        "• Head: Snapdragon Scalers",
        "• Chest: Fyendal's Spring Tunic",
        "• Arms: (swappable same subtype)",
        "• Legs: ...",
        "Start of turn: banish equip → equip same subtype from inventory",
      ],
      permanents: ["(inventory is the special zone)"],
    }),

  librarian: () =>
    playmat({
      heroName: "The Librarian",
      life: 18,
      resources: 1,
      ap: 1,
      inventory: [
        "• Tome of Firebrand",
        "• Tome of Fyendal",
        "• Tome of Aetherwind",
        "Action: reveal Tome from inventory → hand; grant +1{i}",
      ],
      permanents: ["(multiplayer intellect buffs on others)"],
      extra: ["OTHER HERO intellect badges may show temporary +1{i}"],
    }),

  zyggy: () =>
    playmat({
      heroName: "Zyggy",
      life: 32,
      resources: 2,
      ap: 1,
      permanents: [
        "Lightning Flow ×1",
        "Lightning aura A   holo ●",
        "Lightning aura B   holo —  (banish/return candidate)",
      ],
    }),

  "aurora-flow": () =>
    playmat({
      heroName: "Aurora (Flow)",
      life: 31,
      resources: 2,
      ap: 1,
      permanents: ["Lightning Flow ×2", "Embodiment of Lightning ×1"],
    }),

  "oscilio-flow": () =>
    playmat({
      heroName: "Oscilio (Flow)",
      life: 30,
      resources: 1,
      ap: 1,
      statuses: ["discarded-instant-may-play"],
      permanents: ["Lightning Flow ×1", "Ponder ×2"],
    }),

  pleiades: () =>
    playmat({
      heroName: "Pleiades",
      life: 34,
      resources: 1,
      ap: 1,
      statuses: ["crowd: CHEERS"],
      permanents: [
        "Aura of Suspense A   suspense ●●",
        "Aura of Suspense B   suspense ●",
        "Confidence ×1",
        "Hero ability: move suspense counters between auras",
      ],
    }),

  fai: () =>
    playmat({
      heroName: "Fai",
      life: 33,
      resources: 1,
      ap: 1,
      statuses: ["draconic-chain-links: 2"],
      permanents: ["(Phoenix Flame is in GY, not arena)"],
      graveyard: "Phoenix Flame  [starts here]  recycle → hand",
    }),

  "kassai-cintari": () =>
    playmat({
      heroName: "Kassai (Cintari)",
      life: 32,
      resources: 1,
      ap: 1,
      statuses: ["weapon-attacks: 2", "weapon-hits: 1"],
      weapons: "[Cintari Saber][Cintari Saber]",
      permanents: ["Copper ×2", "Cintari Sellsword ally (optional package)"],
    }),

  "kassai-golden": () =>
    playmat({
      heroName: "Kassai (Golden Sand)",
      life: 33,
      resources: 1,
      ap: 1,
      statuses: ["drew-this-turn → sword discount ON"],
      weapons: "[sword][sword]",
      permanents: ["Gold ×1"],
      graveyard: "red/yellow cards for banish-to-Gold setup",
    }),

  victor: () =>
    playmat({
      heroName: "Victor Goldmane",
      life: 36,
      resources: 2,
      ap: 1,
      statuses: ["first-gold-this-turn → drew", "clash ready"],
      permanents: ["Gold ×3"],
      extra: ["CLASH UI: reveal / re-clash by destroying Gold"],
    }),

  olympia: () =>
    playmat({
      heroName: "Olympia",
      life: 32,
      resources: 1,
      ap: 1,
      statuses: ["wager-won-this-attack → Gold"],
      permanents: ["Gold ×2"],
      extra: ["WAGER UI on attacks"],
    }),

  puffin: () =>
    playmat({
      heroName: "Puffin",
      life: 30,
      resources: 1,
      ap: 1,
      statuses: ["cranked-this-turn: 2 → draw"],
      permanents: ["Gold ×1", "Golden Cog  steam ●  [crank]"],
    }),

  marlynn: () =>
    playmat({
      heroName: "Marlynn",
      life: 31,
      resources: 0,
      ap: 1,
      arsenal: "FACE-UP arrow (from draw)",
      permanents: ["Gold ×1"],
      hand: "Goldfin Harpoon (created) + arrows",
    }),

  scurv: () =>
    playmat({
      heroName: "Scurv",
      life: 28,
      resources: 0,
      ap: 1,
      permanents: ["Gold ×1", "Goldkiss Rum ×2  (tap hero, destroy → go again)"],
    }),

  valda: () =>
    playmat({
      heroName: "Valda",
      life: 35,
      resources: 2,
      ap: 1,
      statuses: ["seismic≥3 → crush DOMINATE this turn"],
      permanents: ["Seismic Surge ×4"],
    }),

  iyslander: () =>
    playmat({
      heroName: "Iyslander",
      life: 30,
      resources: 0,
      ap: 0,
      arsenal: "FACE-UP blue non-attack (play as instant off-turn)",
      permanents: ["(own board may be empty)"],
      extra: ["OPPONENT permanents: Frostbite ×2", "Frostbite: +{r} costs, destroys EOT / on play"],
    }),

  lexi: () =>
    playmat({
      heroName: "Lexi",
      life: 32,
      resources: 1,
      ap: 1,
      arsenal: "was face-down Ice → flipped FACE-UP",
      statuses: ["arsenal-flip used", "next-attack-go-again?"],
      permanents: ["(optional)"],
      extra: ["OPPONENT: Frostbite ×1 under their control"],
    }),

  jarl: () =>
    playmat({
      heroName: "Jarl Vetreiði",
      life: 34,
      resources: 1,
      ap: 1,
      permanents: ["(own)"],
      extra: [
        "OPPONENT EQUIPMENT ZONES:",
        "  Head:  EXPOSED → Frostbite sitting in slot",
        "  Chest: armor equipped",
        "  Arms:  EXPOSED → Frostbite",
        "  Legs:  EXPOSED",
        "Frostbite can occupy exposed equipment slots — not only aura row",
      ],
    }),

  briar: () =>
    playmat({
      heroName: "Briar",
      life: 33,
      resources: 1,
      ap: 1,
      statuses: ["non-attack-actions-this-turn: 2"],
      permanents: ["Embodiment of Earth ×1", "Embodiment of Lightning ×1"],
    }),

  "aurora-classic": () =>
    playmat({
      heroName: "Aurora",
      life: 32,
      resources: 2,
      ap: 1,
      statuses: ["played-lightning-this-turn"],
      permanents: ["Embodiment of Lightning ×1"],
    }),

  tuffnut: () =>
    playmat({
      heroName: "Tuffnut",
      life: 36,
      resources: 0,
      ap: 1,
      statuses: ["crowd: CHEERS"],
      permanents: ["Toughness ×2"],
    }),

  lyath: () =>
    playmat({
      heroName: "Lyath Goldmane",
      life: 34,
      resources: 2,
      ap: 1,
      statuses: ["crowd: BOOS", "base p/d HALVED (rounded up)"],
      permanents: ["Might ×2"],
    }),

  "kayo-sup": () =>
    playmat({
      heroName: "Kayo (SUP)",
      life: 33,
      resources: 2,
      ap: 1,
      weapons: "[W1 only]  (1 weapon zone)",
      statuses: ["crowd: BOOS"],
      permanents: ["Vigor ×1"],
    }),

  "kayo-hvy": () =>
    playmat({
      heroName: "Kayo (HVY)",
      life: 34,
      resources: 1,
      ap: 1,
      weapons: "[W1 only]",
      statuses: ["discarded-6+-this-action-phase"],
      permanents: ["Might ×1"],
    }),

  uzuri: () =>
    playmat({
      heroName: "Uzuri",
      life: 32,
      resources: 1,
      ap: 1,
      statuses: ["switchblade AR used?"],
      permanents: ["(stealth attacks)"],
      banished: [
        "• face-down (temporary from hand) → reveal",
        "  if attack ≤2 cost: swaps onto chain link",
      ],
    }),

  kano: () =>
    playmat({
      heroName: "Kano",
      life: 30,
      resources: 0,
      ap: 1,
      statuses: ["banished-as-instant-window open"],
      permanents: ["(arcane)"],
      banished: ["• Aetherize / non-attack  [play as INSTANT this turn]"],
      extra: ["TOP DECK peek result from hero ability"],
    }),

  florian: () =>
    playmat({
      heroName: "Florian",
      life: 32,
      resources: 1,
      ap: 1,
      permanents: [
        "Aura tokens ×N+1 (replacement: create that many plus 1)",
        "Example: would create 1 Ponder → create 2",
      ],
    }),

  yorick: () =>
    playmat({
      heroName: "Yorick",
      life: 18,
      resources: 1,
      ap: 1,
      permanents: ["(bard package)"],
      extra: [
        "SHARED DECK  (all heroes)",
        "SHARED GRAVEYARD (all heroes)",
        "Do NOT render per-player deck/GY piles as authoritative",
      ],
    }),

  melody: () =>
    playmat({
      heroName: "Melody",
      life: 18,
      resources: 1,
      ap: 1,
      permanents: ["Copper ×3  (one per other hero in multiplayer)"],
      extra: ["Multiplayer scale: Copper count tracks hero count − 1"],
    }),

  brevant: () =>
    playmat({
      heroName: "Brevant",
      life: 18,
      resources: 1,
      ap: 1,
      statuses: ["protected-another-hero"],
      permanents: ["Might ×1"],
    }),

  terra: () =>
    playmat({
      heroName: "Terra",
      life: 18,
      resources: 1,
      ap: 0,
      pitch: "Earth card present → end-phase May pay {r}: Might",
      permanents: ["Might ×1"],
    }),

  reya: () =>
    playmat({
      heroName: "Reya",
      life: 18,
      resources: 1,
      ap: 1,
      statuses: ["protect available"],
      permanents: ["Gold ×1 (from protecting another hero)"],
    }),

  squizzy: () =>
    playmat({
      heroName: "Squizzy & Floof",
      life: 16,
      resources: 1,
      ap: 1,
      permanents: ["Gold ×2"],
      extra: [
        "OPPONENT start of turn: may create Cracked Bauble in hand",
        "If they do → you create Gold",
      ],
    }),

  genis: () =>
    playmat({
      heroName: "Genis Wotchuneed",
      life: 18,
      resources: 2,
      ap: 1,
      permanents: ["Silver ×2"],
    }),

  kavdaen: () =>
    playmat({
      heroName: "Kavdaen",
      life: 18,
      resources: 3,
      ap: 1,
      permanents: ["Copper ×1"],
      extra: ["Ability equalizes highest/lowest life among heroes"],
    }),

  "fightmaster-kox": () =>
    playmat({
      heroName: "Fightmaster Kox",
      life: 18,
      resources: 1,
      ap: 1,
      permanents: ["Gold ×1"],
      extra: ["EVENT DECK: look top 3, reorder (multiplayer)"],
    }),

  betsy: () =>
    playmat({
      heroName: "Betsy",
      life: 34,
      resources: 2,
      ap: 1,
      statuses: ["wager pending — may pay {r}{r} for +1{p} overpower"],
      permanents: ["(wager package)"],
      extra: ["WAGER UI on attacks you control"],
    }),

  // Tier B
  azalea: () =>
    playmat({
      heroName: "Azalea",
      life: 32,
      resources: 0,
      ap: 1,
      arsenal: "FACE-UP arrow (dominate if reloaded)",
      permanents: ["(bow / quiver)"],
      weapons: "[Death Dealer][Quiver]",
    }),

  riptide: () =>
    playmat({
      heroName: "Riptide",
      life: 31,
      resources: 1,
      ap: 1,
      arsenal: "face-down (loaded from hand)",
      permanents: ["Trap in arsenal/hand package"],
      statuses: ["trap-triggered → 1 damage"],
    }),

  dorinthea: () =>
    playmat({
      heroName: "Dorinthea",
      life: 34,
      resources: 1,
      ap: 1,
      weapons: "[Dawnblade]",
      statuses: ["extra-weapon-attack-available"],
      permanents: ["(warrior attacks)"],
    }),

  hala: () =>
    playmat({
      heroName: "Hala",
      life: 32,
      resources: 3,
      ap: 1,
      weapons: "[Sword] +1{p} counter (Sharpen — remove EOT)",
      permanents: ["(sharpen is on weapon, not a token)"],
    }),

  rhinar: () =>
    playmat({
      heroName: "Rhinar",
      life: 36,
      resources: 0,
      ap: 1,
      statuses: ["intimidate pending return EOT"],
      permanents: ["(brute)"],
      banished: ["• face-down (intimidated from opponent hand)"],
    }),

  katsu: () =>
    playmat({
      heroName: "Katsu",
      life: 33,
      resources: 0,
      ap: 1,
      permanents: ["(combo chain)"],
      banished: ["• combo card FACE-UP [may play this turn]"],
    }),

  "kayo-runt": () =>
    playmat({
      heroName: "Kayo (Runt)",
      life: 17,
      resources: 1,
      ap: 1,
      statuses: ["die roll UI: 1/4 halve · 5/6 double base {p}"],
      permanents: ["(6+ power attacks)"],
    }),

  crix: () =>
    playmat({
      heroName: "Groundbreaker Crix",
      life: 18,
      resources: 1,
      ap: 1,
      permanents: ["Seismic Surge ×1 (from clash)"],
      extra: ["CLASH vs Guardian heroes on attack"],
    }),

  frankie: () =>
    playmat({
      heroName: "Frankie",
      life: 18,
      resources: 3,
      ap: 1,
      equipment: "scavenged gear from GY",
      permanents: ["(no signature tokens — equipment economy)"],
      banished: ["equipment that would have gone to GY"],
      graveyard: "equip targets from any GY",
    }),
};

function buildFixture(hero: FabHeroSpecialUiRequirement): FabHeroTextFixture {
  const builder = BOARD_BUILDERS[hero.id];
  if (!builder) {
    throw new Error(
      `Missing text board builder for hero-special id "${hero.id}". Add BOARD_BUILDERS entry.`,
    );
  }

  const board = builder(hero);
  const header = [
    `FIXTURE id: ${hero.id}`,
    `Hero: ${hero.hero}  |  Tier ${hero.tier}  |  ${hero.classOrTalent}`,
    `Slugs: ${hero.slugs.join(", ")}`,
    "",
    "MUST SHOW (acceptance checklist):",
    mustShowBlock(hero.mustShow),
    "",
    "UI MODULES:",
    modulesBlock(hero.modules),
    hero.notes ? `\nNOTES: ${hero.notes}` : "",
    "",
    "ASCII BOARD (visual target):",
    board,
  ]
    .filter((line) => line !== undefined)
    .join("\n");

  return {
    id: hero.id,
    hero: hero.hero,
    tier: hero.tier,
    mustShow: hero.mustShow,
    modules: hero.modules,
    board: header,
    summary: `${hero.hero}: ${hero.mustShow[0] ?? "special UI"}`,
  };
}

export const FAB_HERO_TEXT_FIXTURES: readonly FabHeroTextFixture[] =
  listHeroesWithTextFixtures().map(buildFixture);

export function getHeroTextFixture(id: string): FabHeroTextFixture | undefined {
  return FAB_HERO_TEXT_FIXTURES.find((f) => f.id === id);
}

/** Concatenate all fixtures for markdown export / snapshot. */
export function renderAllHeroTextFixtures(): string {
  const lines = [
    "# FAB Hero Special UI — Visual Text Fixtures",
    "",
    "Auto-rendered from `textFixtures.ts`. Do not hand-edit this file body;",
    "edit the TypeScript builders and re-run the test / export script.",
    "",
    `Fixtures: ${FAB_HERO_TEXT_FIXTURES.length}`,
    `Catalog entries: ${HERO_SPECIAL_UI_CATALOG.length}`,
    "",
    "---",
    "",
  ];

  for (const fixture of FAB_HERO_TEXT_FIXTURES) {
    lines.push(fixture.board, "", "---", "");
  }

  return lines.join("\n");
}

/** Compact UX table for engineer handoff. */
export function renderUxHandoffTable(): string {
  const header = [
    "# FAB Hero Special UI — UX Engineer Handoff",
    "",
    "Each row is a hero family that needs UI beyond the universal playmat.",
    "Implement the listed **modules** once, then compose per hero.",
    "Validate against the matching ASCII fixture in `text-fixtures.md`.",
    "",
  ];

  const rows = HERO_SPECIAL_UI_CATALOG.map((h) => {
    const must = h.mustShow.map((m) => m.replace(/\|/g, "/")).join("<br>");
    const mods = h.modules.join(", ");
    const tokens = h.signatureTokens.join(", ") || "—";
    return [`\`${h.id}\``, h.hero, h.tier, must, mods, tokens] as const;
  });

  return [
    ...header,
    ...renderMarkdownTable(["ID", "Hero", "Tier", "Must show", "Modules", "Tokens"], rows),
    "",
  ].join("\n");
}

function renderMarkdownTable(
  header: readonly string[],
  rows: readonly (readonly string[])[],
): readonly string[] {
  const widths = header.map((cell, index) =>
    Math.max(cell.length, ...rows.map((row) => row[index]?.length ?? 0)),
  );
  const formatRow = (row: readonly string[]) =>
    `| ${row.map((cell, index) => cell.padEnd(widths[index] ?? 0)).join(" | ")} |`;

  return [
    formatRow(header),
    `| ${widths.map((width) => "-".repeat(width)).join(" | ")} |`,
    ...rows.map(formatRow),
  ];
}
