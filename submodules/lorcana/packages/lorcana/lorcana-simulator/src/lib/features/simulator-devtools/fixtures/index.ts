import type { LorcanaSimulatorFixture } from "@/features/simulator/model/contracts.js";
import {
  createFixtureLoaderRegistry,
  type FixtureManifestEntry,
  type LorcanaFixtureLoaderEntry,
} from "./registry.js";

export const DEFAULT_LORCANA_FIXTURE_ID = "empty-board";

async function loadAndValidateFixture(
  fixtureId: string,
  load: () => Promise<LorcanaSimulatorFixture>,
): Promise<LorcanaSimulatorFixture> {
  const fixture = await load();
  if (fixture.id !== fixtureId) {
    throw new Error(`Fixture loader for "${fixtureId}" returned "${fixture.id}"`);
  }

  return fixture;
}

const fixtureLoaderRegistry = createFixtureLoaderRegistry(
  [
    {
      id: "empty-board",
      name: "Empty Board",
      description: "Empty board with no cards in play.",
      load: () =>
        loadAndValidateFixture("empty-board", () =>
          import("./empty-board.js").then((module) => module.emptyBoardFixture),
        ),
    },
    {
      id: "opening-hand",
      name: "Opening Hand",
      description: "Opening hand state: each player has 7 cards in hand, no board cards in play.",
      load: () =>
        loadAndValidateFixture("opening-hand", () =>
          import("./opening-hand.js").then((module) => module.openingHandFixture),
        ),
    },
    {
      id: "opening-skirmish",
      name: "Opening Skirmish",
      description: "Small opening board with both hands visible in authoritative mode.",
      load: () =>
        loadAndValidateFixture("opening-skirmish", () =>
          import("./opening-skirmish.js").then((module) => module.openingSkirmishFixture),
        ),
    },
    {
      id: "board-pressure",
      name: "Board Pressure",
      description: "Mid-game pressure state with larger play zones and discard piles.",
      load: () =>
        loadAndValidateFixture("board-pressure", () =>
          import("./board-pressure.js").then((module) => module.boardPressureFixture),
        ),
    },
    {
      id: "late-game",
      name: "Late Game",
      description:
        "Late game state with nearly full boards and high lore counts approaching win condition.",
      load: () =>
        loadAndValidateFixture("late-game", () =>
          import("./late-game.js").then((module) => module.lateGameFixture),
        ),
    },
    {
      id: "pre-game",
      name: "Pre-Game",
      description: "Fresh hands and realistic decks for running full pre-game setup flow.",
      load: () =>
        loadAndValidateFixture("pre-game", () =>
          import("./pre-game.js").then((module) => module.preGameFixture),
        ),
    },
    {
      id: "win-state",
      name: "Win State",
      description: "Player Two has reached 20 lore and won the game.",
      load: () =>
        loadAndValidateFixture("win-state", () =>
          import("./win-state.js").then((module) => module.winStateFixture),
        ),
    },
    {
      id: "card-states",
      name: "Card States Demo",
      description: "Board demonstrating various card states: ready, exerted, damaged, etc.",
      load: () =>
        loadAndValidateFixture("card-states", () =>
          import("./card-states.js").then((module) => module.cardStatesFixture),
        ),
    },
    {
      id: "all-card-types-full-board",
      name: "All Card Types in one Board",
      description: "Show Case of a full board with all card types ",
      load: () =>
        loadAndValidateFixture("all-card-types-full-board", () =>
          import("./full-board-all-card-types.js").then((module) => module.fullBoardAllCardTypes),
        ),
    },
    {
      id: "look-at-the-top",
      name: "Look at the top",
      description:
        "Testing various scenarios in which the player is prompted to look at the top cards",
      load: () =>
        loadAndValidateFixture("look-at-the-top", () =>
          import("./look-at-the-top.js").then((module) => module.lookAtTheTopFixture),
        ),
    },
    {
      id: "shift",
      name: "Shift",
      description:
        "Testing shift UI: Universal Shift, Puppy Shift, discard-cost Shift, and named Shift with multiple target names",
      load: () =>
        loadAndValidateFixture("shift", () =>
          import("./shift.js").then((module) => module.shiftFixture),
        ),
    },
    {
      id: "maleficent-diablo-free-shift",
      name: "Maleficent & Diablo Free Shift",
      description:
        "Visual validation for Maleficent & Diablo - Evil Incarnate's five-discard-character free Shift path.",
      load: () =>
        loadAndValidateFixture("maleficent-diablo-free-shift", () =>
          import("./maleficent-diablo-free-shift.js").then(
            (module) => module.maleficentDiabloFreeShiftFixture,
          ),
        ),
    },
    {
      id: "challenge-keywords",
      name: "Challenge Keywords",
      description:
        "Testing challenge-related keywords: Alert, Bodyguard, Evasive, Challenger, Rush, Reckless",
      load: () =>
        loadAndValidateFixture("challenge-keywords", () =>
          import("./challenge-keywords.js").then((module) => module.challengeKeywordsFixture),
        ),
    },
    {
      id: "defensive-keywords",
      name: "Defensive Keywords",
      description: "Testing defensive keywords: Ward, Vanish, Resist",
      load: () =>
        loadAndValidateFixture("defensive-keywords", () =>
          import("./defensive-keywords.js").then((module) => module.defensiveKeywordsFixture),
        ),
    },
    {
      id: "quest-keywords",
      name: "Quest Keywords",
      description: "Testing quest-related keywords: Support, Singer, Sing Together",
      load: () =>
        loadAndValidateFixture("quest-keywords", () =>
          import("./quest-keywords.js").then((module) => module.questKeywordsFixture),
        ),
    },
    {
      id: "boost-keyword",
      name: "Boost Keyword",
      description: "Testing Boost keyword: pay ink to put top card of deck under character",
      load: () =>
        loadAndValidateFixture("boost-keyword", () =>
          import("./boost-keyword.js").then((module) => module.boostKeywordFixture),
        ),
    },
    {
      id: "multiple-triggers",
      name: "Multiple Triggers",
      description: "Testing scenario where multiple triggers fire at once",
      load: () =>
        loadAndValidateFixture("multiple-triggers", () =>
          import("./multiple-triggers.js").then((module) => module.multipleTriggers),
        ),
    },
    {
      id: "discard-effects",
      name: "Discard Effects",
      description:
        "Manual discard test bed covering reveal-and-choose discard, opponent-chosen discard, random discard, discard-as-cost, discard-any-number, and discard with a payoff from the discarded card.",
      load: () =>
        loadAndValidateFixture("discard-effects", () =>
          import("./discard-effects.js").then((module) => module.discardEffectsFixture),
        ),
    },
    {
      id: "modal-abilities",
      name: "Modal Abilities",
      description:
        "Manual modal test bed covering controller choose-one branches, opponent-picked targets and discards, and chosen-opponent modal responses.",
      load: () =>
        loadAndValidateFixture("modal-abilities", () =>
          import("./modal-abilities.js").then((module) => module.modalAbilitiesFixture),
        ),
    },
    {
      id: "player-selection",
      name: "Player Selection",
      description:
        "Manual player-targeting sandbox covering direct chosen-player effects, chosen-player hidden-zone interactions, and chosen-player follow-up choice flows.",
      load: () =>
        loadAndValidateFixture("player-selection", () =>
          import("./player-selection.js").then((module) => module.playerSelectionFixture),
        ),
    },
    {
      id: "monstro-combo",
      name: "Monstro + Donald Duck Combo",
      description:
        "Test the FULL BREACH + COMBO shortcut. Player one has Monstro in play and Donald Duck in hand with enough ink to play. After playing Donald, Monstro should gain the combo shortcut ability.",
      load: () =>
        loadAndValidateFixture("monstro-combo", () =>
          import("./monstro-combo.js").then((module) => module.monstroComboFixture),
        ),
    },
    {
      id: "move-damage",
      name: "Move Damage Effects",
      description:
        "Test bed for move-damage effects: Cheshire Cat's IT'S LOADS OF FUN trigger and Can't Hold It Back Anymore action that moves all damage counters to a chosen opponent character.",
      load: () =>
        loadAndValidateFixture("move-damage", () =>
          import("./move-damage.js").then((module) => module.moveDamageFixture),
        ),
    },
    {
      id: "alternative-costs",
      name: "Alternative Costs",
      description:
        "Testing alternative cost UI: Belle (banish item to play for free) and Scrooge McDuck (exert 4 items to play for free). Player has 0 ink to force alternative cost usage.",
      load: () =>
        loadAndValidateFixture("alternative-costs", () =>
          import("./alternative-costs.js").then((module) => module.alternativeCostsFixture),
        ),
    },
    {
      id: "bibbidi-bobbidi-boo",
      name: "Bibbidi Bobbidi Boo",
      description:
        "Visual setup for Bibbidi Bobbidi Boo. Play the song/action, choose one of your characters in play to return, then choose a character in hand with the same cost or less to play for free. Includes multiple eligible targets and one higher-cost hand card that should stay unavailable after returning Flynn.",
      load: () =>
        loadAndValidateFixture("bibbidi-bobbidi-boo", () =>
          import("./bibbidi-bobbidi-boo.js").then((module) => module.bibbidiBobbidiBooFixture),
        ),
    },
    {
      id: "pongo-dear-old-dad",
      name: "Pongo - Dear Old Dad (Inkwell Puppy Play)",
      description:
        "Pongo sits in play. Three Puppy characters (Freckles, Lucky, Perdita) and two non-Puppy cards are in the inkwell. At the start of playerOne's turn, Pongo's ability triggers — look at the inkwell and optionally play a Puppy for free.",
      load: () =>
        loadAndValidateFixture("pongo-dear-old-dad", () =>
          import("./pongo-dear-old-dad.js").then((module) => module.pongoDearOldDadFixture),
        ),
    },
    {
      id: "sing-second-star",
      name: "Sing Second Star (Enchanted)",
      description:
        "Reproduce the player report: try to sing Second Star to the Right (Enchanted) using characters that total 10+ cost. Player one has the enchanted song in hand and ready, dry singers in play. Also enough ink to hard-cast for comparison.",
      load: () =>
        loadAndValidateFixture("sing-second-star", () =>
          import("./sing-second-star.js").then((module) => module.singSecondStarFixture),
        ),
    },
    {
      id: "sugar-rush-speedway-starting-line-finish-line",
      name: "Sugar Rush Speedway Starting Line to Finish Line",
      description:
        "Stages Starting Line, Finish Line, and two racers so the free move, damage, target filtering, and Finish Line move trigger can be inspected in the browser simulator.",
      load: () =>
        loadAndValidateFixture("sugar-rush-speedway-starting-line-finish-line", () =>
          import("./sugar-rush-speedway-starting-line-finish-line.js").then(
            (module) => module.sugarRushSpeedwayStartingLineFinishLineFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-05-goofy-set-for-adventure",
      name: "Triage 2026-05-05 — Goofy Set for Adventure (4 reports)",
      description:
        "Player reports: 'lets me select a character to move but won't let me actually move them to the location'. Repro: move Goofy to Pizza Planet, then on the Family Vacation trigger choose Goofy Musketeer — verify the Musketeer relocates and you draw a card.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-05-goofy-set-for-adventure", () =>
          import("./triage-2026-05-05-goofy-set-for-adventure.js").then(
            (module) => module.triage20260505GoofySetForAdventureFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-05-touch-the-sky",
      name: "Triage 2026-05-05 — Touch the Sky (2 reports)",
      description:
        "Player reports: 'would not allow me to choose character to move to which location or confirm'. Repro: play Touch the Sky from hand, then pick a character + a location — both target slots must prompt and confirm.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-05-touch-the-sky", () =>
          import("./triage-2026-05-05-touch-the-sky.js").then(
            (module) => module.triage20260505TouchTheSkyFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-05-diablo-discard-shift",
      name: "Triage 2026-05-05 — Diablo Devoted Herald discard-shift (2 reports)",
      description:
        "Player reports: 'Can't shift Diablo even though I have \"You Have Forgotten Me\" in hand to discard'. Repro: shift Diablo Devoted Herald onto Diablo Maleficent's Spy, paying the alt cost by discarding an action card from hand (You Have Forgotten Me or Brawl).",
      load: () =>
        loadAndValidateFixture("triage-2026-05-05-diablo-discard-shift", () =>
          import("./triage-2026-05-05-diablo-discard-shift.js").then(
            (module) => module.triage20260505DiabloDiscardShiftFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-05-mad-hatter-scry",
      name: "Triage 2026-05-05 — Mad Hatter Eccentric Host (1 report)",
      description:
        "Player report: 'effect is not resolving. It should allow you to look at the top of either player's deck and then discard or keep the card there'. Repro: quest Mad Hatter, accept the trigger, choose either player, then put their top card on top of their deck OR into their discard.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-05-mad-hatter-scry", () =>
          import("./triage-2026-05-05-mad-hatter-scry.js").then(
            (module) => module.triage20260505MadHatterScryFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-05-mufasa-bogo-reveal-play",
      name: "Triage 2026-05-05 — Mufasa and Chief Bogo reveal play",
      description:
        "Player report: Mufasa - Betrayed Leader and Chief Bogo - Commanding Officer could not properly reveal and play a character for free. Repro path: challenge Maui with Mufasa, accept THE SUN WILL SET, and play Mickey Mouse - True Friend exerted from the revealed deck top. Then pass turn; Maui can challenge Clawhauser, accept SENDING BACKUP, and play Gaston - Baritone Bully ready from the next revealed deck top.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-05-mufasa-bogo-reveal-play", () =>
          import("./triage-2026-05-05-mufasa-bogo-reveal-play.js").then(
            (module) => module.triage20260505MufasaBogoRevealPlayFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-05-syndrome-play-or-shift",
      name: "Triage 2026-05-05 — Syndrome Out for Revenge play-or-shift (1 report)",
      description:
        "Player report: 'I should be able to shift out a robot char with Syndrome's quest ability, but it plays out on its own instead of allowing me the shift opportunity.' Repro: quest Syndrome, return Omnidroid v9 from discard to hand, then on the optional 'play or shift a Robot' choice — verify the player is offered a CHOICE between playing the Omnidroid normally or shifting it onto Omnidroid v8 in play.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-05-syndrome-play-or-shift", () =>
          import("./triage-2026-05-05-syndrome-play-or-shift.js").then(
            (module) => module.triage20260505SyndromePlayOrShiftFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-05-three-arrows-merida-banish",
      name: "Triage 2026-05-05 — Three Arrows + Merida banish (1 report)",
      description:
        "Player report: 'After playing Three Arrows with Merida in play, the two damage counters from Three Arrows show on the characters banished after Merida's trigger resolves.' Repro: P1 plays Three Arrows on Anna (willpower 4). Three Arrows deals 2 damage → STEADY AIM (Merida Formidable Archer) deals 2 more → Anna is banished. Verify no damage counters render on the banished card after the bag drains. Optional second target: deal 1 to Goofy → STEADY AIM adds 2 → Goofy at 3/4 willpower, still in play.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-05-three-arrows-merida-banish", () =>
          import("./triage-2026-05-05-three-arrows-merida-banish.js").then(
            (module) => module.triage20260505ThreeArrowsMeridaBanishFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-05-lucifer-mouse-catcher",
      name: "Triage 2026-05-05 — Lucifer Cunning Cat MOUSE CATCHER (1 report)",
      description:
        "Player report: 'The bot is not discarding due the effect of Lucifer - Cunning Cat'. Repro: P1 plays Lucifer Cunning Cat. MOUSE CATCHER triggers a CHOICE prompt for the OPPONENT (P2) to either discard 2 cards OR discard 1 action card. Verify P2 receives a choice prompt and the resulting discard executes — vs. P2 in the digest replay where the bot silently passed without discarding.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-05-lucifer-mouse-catcher", () =>
          import("./triage-2026-05-05-lucifer-mouse-catcher.js").then(
            (module) => module.triage20260505LuciferMouseCatcherFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-05-emerald-chromicon-banish-trigger",
      name: "Triage 2026-05-05 — Emerald Chromicon EMERALD LIGHT (1 report)",
      description:
        "Player report: 'rarely triggers its ability for the player, but consistently triggers for the Practice AI'. Repro: P1 owns Emerald Chromicon and an exerted 1-willpower character (Heihei). On P2's turn, P2 challenges the exerted Heihei with Goofy Musketeer (str 2) — Heihei is banished during P2's turn → EMERALD LIGHT must add an optional bag entry on P1's side to return chosen character to its owner's hand. Heihei starts exerted because Lorcana's challenge rules require the defender to be exerted (CRD 4.3.4); without that the challenge cannot legally start.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-05-emerald-chromicon-banish-trigger", () =>
          import("./triage-2026-05-05-emerald-chromicon-banish-trigger.js").then(
            (module) => module.triage20260505EmeraldChromiconBanishTriggerFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-06-brawl-cast-maui-rush-challenge",
      name: "Triage 2026-05-06 — Brawl can't cast + Maui Rush can't challenge (2 reports)",
      description:
        "Bug 1: Cast Brawl targeting Simba Protective Cub (strength 2, ≤2 threshold) — should banish it. Bug 2: Challenge with Maui Hero to All (Rush, isDrying) against the exerted Simba — Rush should allow the challenge despite being freshly played.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-06-brawl-cast-maui-rush-challenge", () =>
          import("./triage-2026-05-06-brawl-cast-maui-rush-challenge.js").then(
            (module) => module.triage20260506BrawlCastMauiRushChallengeFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-08-shere-khan-skip-optional",
      name: "Triage 2026-05-08 — Shere Khan ON THE HUNT skip optional",
      description:
        "Player report: 'Shere Khan - Fearsome Tiger ON THE HUNT requires a target for the optional 1-damage step. With no opposing characters left after the banish, the player is forced to damage their own.' Repro: P1 quests Shere Khan (ready). P2 has a single damaged Anna (1 damage). Banish step targets Anna → opponent has no characters left. The optional 'put 1 damage on another chosen character' step should offer a Skip / Cancel button so the controller is not forced to damage themselves.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-08-shere-khan-skip-optional", () =>
          import("./triage-2026-05-08-shere-khan-skip-optional.js").then(
            (module) => module.triage20260508ShereKhanSkipOptionalFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-11-din-bodyguard-enter-exerted",
      name: "Triage 2026-05-11 — DiNO + Bodyguard enter exerted",
      description:
        "Player report: Down in New Orleans played Thunderbolt — Wonder Dog (Bodyguard) into play, but the 'may enter exerted' choice was never offered. Cast DiNO from hand, assign Thunderbolt to play in the scry overlay, confirm. After the fix the simulator should prompt for enter-exerted; engine accepts the param and lands Thunderbolt exerted if chosen.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-11-din-bodyguard-enter-exerted", () =>
          import("./triage-2026-05-11-din-bodyguard-enter-exerted.js").then(
            (module) => module.triage20260511DinBodyguardEnterExertedFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-14-luisa-confident-climber",
      name: "Triage 2026-05-14 - Luisa Confident Climber fourth damage",
      description:
        "Visual repro for digest reports #13/#23. Activate Luisa Madrigal - Confident Climber, move 1 damage from Mulan - Injured Soldier to Luisa, then choose opposing Chief Tui. Expected: Luisa reaches 4 damage only long enough to continue the ability, then all 4 damage move to Chief Tui; Luisa remains in play with 0 damage.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-14-luisa-confident-climber", () =>
          import("./triage-2026-05-14-luisa-confident-climber.js").then(
            (module) => module.triage20260514LuisaConfidentClimberFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-14-bibbidi-bobbidi-boo",
      name: "Triage 2026-05-14 - Bibbidi Bobbidi Boo excludes returned card",
      description:
        "Visual repro for digest report #7. Cast Bibbidi Bobbidi Boo and return Flynn Rider - Confident Vagabond from play. Expected: the follow-up free-play picker offers only another valid character from hand, such as Cheshire Cat, and must not offer the same returned Flynn card as a no-op candidate.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-14-bibbidi-bobbidi-boo", () =>
          import("./triage-2026-05-14-bibbidi-bobbidi-boo.js").then(
            (module) => module.triage20260514BibbidiBobbidiBooFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-14-captain-hook-underhanded",
      name: "Triage 2026-05-14 - Captain Hook Underhanded quest restriction",
      description:
        "Visual repro for digest reports #8/#19. P1's Captain Hook - Underhanded is exerted. Switch to player two in the harness: opposing Pirate characters Roo and Minnie should show no quest action while Hook is exerted, while non-Pirate Mickey Mouse should still be able to quest. Hook himself should not be restricted by his own static effect.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-14-captain-hook-underhanded", () =>
          import("./triage-2026-05-14-captain-hook-underhanded.js").then(
            (module) => module.triage20260514CaptainHookUnderhandedFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-14-the-family-scattered",
      name: "Triage 2026-05-14 - The Family Scattered three destinations",
      description:
        "Visual repro for digest reports #14/#18. Cast The Family Scattered targeting player two. Expected: player two chooses three of their characters across the grouped resolution, then one returns to hand, one goes to bottom of deck, and one goes to top of deck. The action should not stop after processing only one character.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-14-the-family-scattered", () =>
          import("./triage-2026-05-14-the-family-scattered.js").then(
            (module) => module.triage20260514TheFamilyScatteredFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-14-mushu-majestic-dragon",
      name: "Triage 2026-05-14 - Mushu Majestic Dragon Resist stacking",
      description:
        "Visual repro for Mushu Majestic Dragon report. P1's characters should each gain Resist +2 ONLY during their challenge — not stacking across multiple challenges. Challenge P2's first character and note the resist; it should reset after the challenge resolves.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-14-mushu-majestic-dragon", () =>
          import("./triage-2026-05-14-mushu-majestic-dragon.js").then(
            (module) => module.triage20260514MushuMajesticDragonFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-14-beast-snowfield-troublemaker",
      name: "Triage 2026-05-14 - Beast Snowfield Troublemaker Rush bug",
      description:
        "Visual repro for Beast - Snowfield Troublemaker Rush bug. Play Beast from P1's hand — it has Rush and should be able to challenge P2's character immediately.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-14-beast-snowfield-troublemaker", () =>
          import("./triage-2026-05-14-beast-snowfield-troublemaker.js").then(
            (module) => module.triage20260514BeastSnowfieldTroublemakerFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-14-sword-of-shan-yu",
      name: "Triage 2026-05-14 - Sword of Shan Yu item ability",
      description:
        "Visual repro for Sword of Shan Yu item bug. P1 has Sword in play and an exerted character. Activate the Sword by exerting a character — it should ready the chosen character.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-14-sword-of-shan-yu", () =>
          import("./triage-2026-05-14-sword-of-shan-yu.js").then(
            (module) => module.triage20260514SwordOfShanyuFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-14-chernabog-unnatural-force",
      name: "Triage 2026-05-14 - Chernabog Unnatural Force DARK DANCE",
      description:
        "Visual repro for Chernabog - Unnatural Force DARK DANCE. Play Chernabog. The engine should let P1 choose an opposing character to shuffle into their deck; then P2 should get the option to play a character from discard for free.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-14-chernabog-unnatural-force", () =>
          import("./triage-2026-05-14-chernabog-unnatural-force.js").then(
            (module) => module.triage20260514ChernabogUnnaturalForceFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-14-anna-trusting-sister",
      name: "Triage 2026-05-14 - Anna Trusting Sister WE CAN DO THIS TOGETHER",
      description:
        "Visual repro for Anna - Trusting Sister WE CAN DO THIS TOGETHER bug. P1 has Elsa in play. Play Anna — the ability should trigger and let P1 put the top card of their deck into their inkwell facedown and exerted.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-14-anna-trusting-sister", () =>
          import("./triage-2026-05-14-anna-trusting-sister.js").then(
            (module) => module.triage20260514AnnaTrustingSisterFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-14-mrs-incredible-regroup",
      name: "Triage 2026-05-14 - Mrs. Incredible Determined Rescuer REGROUP",
      description:
        "Visual repro for Mrs. Incredible - Determined Rescuer REGROUP bug. P1 challenges and banishes one of P2's characters — the REGROUP ability should trigger and offer to ready a chosen Super character.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-14-mrs-incredible-regroup", () =>
          import("./triage-2026-05-14-mrs-incredible-regroup.js").then(
            (module) => module.triage20260514MrsIncredibleRegroupFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-14-alma-madrigal-leading-the-way",
      name: "Triage 2026-05-14 - Alma Madrigal Leading the Way PROTECTING THE FAMILY",
      description:
        "Visual repro for Alma Madrigal - Leading the Way PROTECTING THE FAMILY bug. P1 has another Madrigal in play. Play Alma — the ability should trigger and offer to exert one of P2's characters.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-14-alma-madrigal-leading-the-way", () =>
          import("./triage-2026-05-14-alma-madrigal-leading-the-way.js").then(
            (module) => module.triage20260514AlmaMadrigalLeadingTheWayFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-14-mr-incredible-super-strong",
      name: "Triage 2026-05-14 - Mr. Incredible Super Strong LET'S DO THIS!",
      description:
        "Visual repro for Mr. Incredible - Super Strong LET'S DO THIS! bug. P1 has Mr. Incredible (Super Strong) in play. Have another Super character (Bob Parr) challenge P2 — Mr. Incredible's ability should trigger and draw a card.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-14-mr-incredible-super-strong", () =>
          import("./triage-2026-05-14-mr-incredible-super-strong.js").then(
            (module) => module.triage20260514MrIncredibleSuperStrongFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-14-tamatoa-happy-as-a-clam",
      name: "Triage 2026-05-14 - Tamatoa Happy as a Clam COOLEST COLLECTION",
      description:
        "Visual repro for Tamatoa - Happy as a Clam COOLEST COLLECTION bug. P1 has 2 item cards in discard. Play Tamatoa — the ability should trigger and let P1 return up to 2 items from discard to hand.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-14-tamatoa-happy-as-a-clam", () =>
          import("./triage-2026-05-14-tamatoa-happy-as-a-clam.js").then(
            (module) => module.triage20260514TamatoaHappyAsAClamFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-14-fergus-outpost-builder",
      name: "Triage 2026-05-14 - Fergus Outpost Builder HOLD FAST",
      description:
        "Visual repro for Fergus - Outpost Builder HOLD FAST bug. Fergus is placed at Island of Nomanisan. P2 challenges and banishes the location — Fergus's HOLD FAST ability should trigger and offer to deal 4 damage to a chosen character.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-14-fergus-outpost-builder", () =>
          import("./triage-2026-05-14-fergus-outpost-builder.js").then(
            (module) => module.triage20260514FergusOutpostBuilderFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-14-this-growing-pressure",
      name: "Triage 2026-05-14 - This Growing Pressure forced quest",
      description:
        "Visual repro for This Growing Pressure bug. P1 plays This Growing Pressure, choosing P2's Chief Tui. On P2's next turn, Chief Tui should be forced to quest if able and unable to challenge. Switch to P2 and verify Chief Tui has a quest obligation and cannot challenge.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-14-this-growing-pressure", () =>
          import("./triage-2026-05-14-this-growing-pressure.js").then(
            (module) => module.triage20260514ThisGrowingPressureFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-14-cant-hold-it-back-anymore",
      name: "Triage 2026-05-14 - Can't Hold It Back Anymore damage transfer",
      description:
        "Visual repro for Can't Hold It Back Anymore bug. P1 plays the song. Choose P2's Chief Tui — the chosen character should become exerted and receive all damage counters from all other characters.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-14-cant-hold-it-back-anymore", () =>
          import("./triage-2026-05-14-cant-hold-it-back-anymore.js").then(
            (module) => module.triage20260514CantHoldItBackAnymoreFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-14-omnidroid-v9-shift",
      name: "Triage 2026-05-14 - Omnidroid v9 ENEMY DETECTED shift ability",
      description:
        "Visual repro for Omnidroid v9 ENEMY DETECTED shift ability bug. P1 shifts Omnidroid v9 onto the Omnidroid v8 in play. After shifting, the ENEMY DETECTED ability should trigger and offer to deal 2 damage to a chosen character.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-14-omnidroid-v9-shift", () =>
          import("./triage-2026-05-14-omnidroid-v9-shift.js").then(
            (module) => module.triage20260514OmnidroidV9ShiftFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-15-hand-in-the-box-spring-loaded",
      name: "Triage 2026-05-15 - Hand-in-the-Box SPRING-LOADED",
      description:
        "Visual repro for Hand-in-the-Box - Sid's Toy SPRING-LOADED. P1 has Hand-in-the-Box in hand, zero ink, and Wind-Up Frog - Sid's Toy in discard. The hand action should let P1 choose the Toy from discard and play Hand-in-the-Box for free.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-15-hand-in-the-box-spring-loaded", () =>
          import("./triage-2026-05-15-hand-in-the-box-spring-loaded.js").then(
            (module) => module.triage20260515HandInTheBoxSpringLoadedFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-16-luisa-and-isabela-feel-better",
      name: "Triage 2026-05-16 — Luisa + Isabela `to: SELF` move-damage",
      description:
        "Hand-test PR #114: both Luisa Madrigal — Confident Climber (`I CAN TAKE IT`) and Isabela Madrigal — Perfectly in Control (`FEEL BETTER`) use the `from: CHOSEN_CHARACTER_OF_YOURS, to: SELF` move-damage direction. Pre-PR-114 the engine→UI converter assumed the auto-bound slot was always FROM, which silently dropped both prompts. Steps: (1) activate Luisa `I CAN TAKE IT` (1 ink) → prompt should ask for a damaged character of yours (Mulan or Chief Tui); damage transfers to Luisa. (2) quest Isabela → `FEEL BETTER` triggers; prompt should ask for a damaged character of yours; all damage moves onto Isabela. With the fix, both prompts confirm; without it, the bag stays pending and neither effect resolves.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-16-luisa-and-isabela-feel-better", () =>
          import("./triage-2026-05-16-luisa-and-isabela-feel-better.js").then(
            (module) => module.triage20260516LuisaAndIsabelaFeelBetterFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-18-luisa-mulan-move-damage",
      name: "Triage 2026-05-18 - Luisa + Mulan move damage",
      description:
        "Visual validation for Luisa Madrigal - Confident Climber's I CAN TAKE IT against both destination states. P1 controls two ready Luisas: one with 0 damage and one with 2 damage, plus Mulan - Injured Soldier with 2 damage. Activate the undamaged Luisa and choose Mulan: 1 damage should move to Luisa without opening the opposing-character follow-up. Then activate the damaged Luisa and choose Mulan: 1 damage should move to Luisa, she should reach 3 damage, and the follow-up should let you move all damage from that Luisa to opposing Chief Tui.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-18-luisa-mulan-move-damage", () =>
          import("./triage-2026-05-18-luisa-mulan-move-damage.js").then(
            (module) => module.triage20260518LuisaMulanMoveDamageFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-18-firefly-swarm-choice",
      name: "Triage 2026-05-18 - Firefly Swarm choice target",
      description:
        "Daily feedback visual repro for Firefly Swarm. Play Firefly Swarm, choose the 2-strength-or-less branch, then Dale - Ready for His Shot should be selectable as the target instead of the prompt hanging.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-18-firefly-swarm-choice", () =>
          import("./triage-2026-05-18-daily-feedback.js").then(
            (module) => module.triage20260518FireflySwarmChoiceFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-18-firefly-swarm-discard-metric",
      name: "Triage 2026-05-18 - Firefly Swarm discard metric",
      description:
        "Daily feedback visual repro for Firefly Swarm's second branch. Move two other cards from hand to discard this turn, play Firefly Swarm, then the 2+ discard branch should make a higher-strength character selectable and banishable.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-18-firefly-swarm-discard-metric", () =>
          import("./triage-2026-05-18-daily-feedback.js").then(
            (module) => module.triage20260518FireflySwarmDiscardMetricFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-18-firefly-swarm-robin-hood-free-play",
      name: "Triage 2026-05-18 - Firefly Swarm Robin Hood free play",
      description:
        "Replay mg92g0Tl2dnLSAwwrwbYHDw turn 8 repro. Quest Robin Hood - Sharpshooter, play Firefly Swarm for free from the scry, then Firefly's first mode should advance into target selection instead of inheriting the parent optional and going straight to discard.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-18-firefly-swarm-robin-hood-free-play", () =>
          import("./triage-2026-05-18-daily-feedback.js").then(
            (module) => module.triage20260518FireflySwarmRobinHoodFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-18-education-or-elimination-choice",
      name: "Triage 2026-05-18 - Education or Elimination choice target",
      description:
        "Daily feedback visual repro for Education or Elimination. Play the song, choose the damaged-character banish branch, then the damaged opposing Simba should be selectable.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-18-education-or-elimination-choice", () =>
          import("./triage-2026-05-18-daily-feedback.js").then(
            (module) => module.triage20260518EducationOrEliminationChoiceFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-18-megabot-destroy-choice",
      name: "Triage 2026-05-18 - MegaBot DESTROY choice target",
      description:
        "Daily feedback visual repro for MegaBot. Activate DESTROY!, choose the damaged-character branch, then the damaged opposing Simba should be selectable after MegaBot pays its cost.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-18-megabot-destroy-choice", () =>
          import("./triage-2026-05-18-daily-feedback.js").then(
            (module) => module.triage20260518MegaBotDestroyChoiceFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-18-black-cauldron-mufasa",
      name: "Triage 2026-05-18 - Black Cauldron Mufasa",
      description:
        "Daily feedback visual repro for The Black Cauldron. Activate RISE AND JOIN ME!, then Mufasa - Ruler of Pride Rock should be available to play from under the item with sufficient ink.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-18-black-cauldron-mufasa", () =>
          import("./triage-2026-05-18-daily-feedback.js").then(
            (module) => module.triage20260518BlackCauldronMufasaFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-18-luisa-undamaged-source",
      name: "Triage 2026-05-18 - Luisa undamaged source",
      description:
        "Daily feedback visual repro for Luisa Madrigal - Confident Climber. Activate I CAN TAKE IT with Luisa already at 3 damage; the undamaged friendly Simba should still be selectable for the up-to-1 source step, then Luisa's damage can move to the opposing Mickey.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-18-luisa-undamaged-source", () =>
          import("./triage-2026-05-18-daily-feedback.js").then(
            (module) => module.triage20260518LuisaUndamagedSourceFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-17-tiana-dale-bot-challenge",
      name: "Triage 2026-05-17 - Tiana and Dale challenge validation",
      description:
        "Visual validation for R2, game game-1778915049625-vb6bksq65. P1 controls Dale - Excited Friend with 3 ink. P2 controls exerted Tiana - Restaurant Owner and an exerted Mickey Mouse. Challenge Mickey with Dale. Expected: Tiana's SPECIAL RESERVATION prompt clearly offers the challenger either pay 3 ink or take -3 strength before combat damage; this fixture is for validating the UI/bot decision surface, not a card-definition fix.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-17-tiana-dale-bot-challenge", () =>
          import("./triage-2026-05-17-remaining.js").then(
            (module) => module.triage20260517TianaDaleBotChallengeFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-17-kristoffs-lute-play-top",
      name: "Triage 2026-05-17 - Kristoff's Lute play top card",
      description:
        "Visual validation for R5, game mgmSe8nSmmA9Y1XfygT7LoD. Activate Kristoff's Lute with Lilo - Making a Wish on top of the deck. Expected: the reveal prompt offers a playable option for Lilo, and choosing it plays Lilo instead of forcing the discard option.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-17-kristoffs-lute-play-top", () =>
          import("./triage-2026-05-17-remaining.js").then(
            (module) => module.triage20260517KristoffsLutePlayTopFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-17-leviathan-return-of-hercules",
      name: "Triage 2026-05-17 - Leviathan via Return of Hercules",
      description:
        "Visual validation for R6/R7, games mgU_ohnBSpmzi0OpwtQ9jIr and mgIIWaYi9CzTdE2NDmx3i9Y. Play both Befuddles first so 2 cards enter P1's discard this turn, then play The Return of Hercules and use it to play The Leviathan for free. Expected: Leviathan's optional trigger can be accepted, opposing characters can be selected up to the 10-strength budget, and unselecting a target does not accidentally decline the optional trigger.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-17-leviathan-return-of-hercules", () =>
          import("./triage-2026-05-17-remaining.js").then(
            (module) => module.triage20260517LeviathanReturnOfHerculesFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-17-hamm-piggy-bank-exert",
      name: "Triage 2026-05-17 - Hamm Piggy Bank exert option",
      description:
        "Visual validation for R12, game mgSZZn_DHQso8CQeuxHC5cw. P1 has a dry Hamm - Piggy Bank, 2 ink, and Mickey Mouse - True Friend in hand. Expected: Hamm's LOOSE CHANGE exert ability is available; after using it, Mickey can be played with the 1-ink reduction.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-17-hamm-piggy-bank-exert", () =>
          import("./triage-2026-05-17-remaining.js").then(
            (module) => module.triage20260517HammPiggyBankExertFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-17-mirabel-curious-child-reveal",
      name: "Triage 2026-05-17 - Mirabel Curious Child reveal song",
      description:
        "Visual validation for R13/R21/R30 plus replay mgPhI4ZWHvdLtbIVE-jXmRj turn 11. In mobile responsive mode, play Mirabel Madrigal - Curious Child, accept YOU ARE A WONDER, and select Friends on the Other Side from hand. Expected: the optional prompt appears and can be accepted, the song is visibly selectable, the confirm action becomes visible/enabled after selection, the song is revealed, P1 gains 1 lore, and the mobile hand/prompt/confirm controls do not clip or overlap.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-17-mirabel-curious-child-reveal", () =>
          import("./triage-2026-05-17-remaining.js").then(
            (module) => module.triage20260517MirabelCuriousChildRevealFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-17-bibbidi-another-character",
      name: "Triage 2026-05-17 - Bibbidi requires another character",
      description:
        "Visual validation for R15, game mgROtD79El-bAfC4PoFxzMt. Cast Bibbidi Bobbidi Boo and return Flynn Rider - Confident Vagabond. Expected: the follow-up free-play picker must not offer the same returned Flynn card, because Bibbidi says to play another character with the same cost or less.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-17-bibbidi-another-character", () =>
          import("./triage-2026-05-17-remaining.js").then(
            (module) => module.triage20260517BibbidiAnotherCharacterFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-17-hades-target-clarity",
      name: "Triage 2026-05-17 - Hades target clarity",
      description:
        "Visual validation for R18, game mgLRYqwzW5Evso46iNsA8ML. Play Hades - Looking for a Deal and choose one of two opposing characters. Expected: the selected character remains visually clear while the opponent chooses whether to bottom that character or let P1 draw 2.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-17-hades-target-clarity", () =>
          import("./triage-2026-05-17-remaining.js").then(
            (module) => module.triage20260517HadesTargetClarityFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-17-cheshire-cat-boost-move-one",
      name: "Triage 2026-05-17 - Cheshire Cat Boost move one damage",
      description:
        "Visual validation for R8/R19, games game-1778940835595-j22xxbwh7 and mgX28M_HsdDloODk4wrE7G-. Activate Cheshire Cat - Inexplicable's Boost, accept IT'S LOADS OF FUN, then move only 1 of Lilo's 2 damage to Mickey. Expected: the UI supports an up-to-2 amount choice, including moving exactly 1 damage instead of forcing 2.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-17-cheshire-cat-boost-move-one", () =>
          import("./triage-2026-05-17-remaining.js").then(
            (module) => module.triage20260517CheshireCatBoostMoveOneFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-17-wind-up-frog-toy-banish",
      name: "Triage 2026-05-17 - Wind-Up Frog Toy banish discount",
      description:
        "Visual validation for R24, game mgihdxdTZ6LLUNYi_vwbXmq. P1 has Wind-Up Frog - Sid's Toy in hand with 0 ink and Hamm in play. Challenge the exerted Goofy with Hamm so Hamm is banished in combat. Expected: Wind-Up Frog becomes playable for free after one of your Toy characters is banished this turn.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-17-wind-up-frog-toy-banish", () =>
          import("./triage-2026-05-17-remaining.js").then(
            (module) => module.triage20260517WindUpFrogToyBanishFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-17-lyle-dirty-tricks",
      name: "Triage 2026-05-17 - Lyle Dirty Tricks end turn",
      description:
        "Visual validation for R26, game mgfygMiKLn39tocvUbWjjzE. P1 has Lyle Tiberius Rourke - Adventurer for Hire in play and two Befuddles in hand. Play both Befuddles so 2 cards enter P1's discard this turn, then end the turn. Expected: DIRTY TRICKS triggers at end of turn and P2 loses 1 lore; if Lyle is in discard instead of play, no trigger should appear.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-17-lyle-dirty-tricks", () =>
          import("./triage-2026-05-17-remaining.js").then(
            (module) => module.triage20260517LyleDirtyTricksFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-17-sid-double-prizes",
      name: "Triage 2026-05-17 - Sid Double Prizes",
      description:
        "Visual validation for R27, game mgb8SeNGg9rcir5ILzWGLgB. Play Sid Phillips - Toy Surgeon, choose your Hamm for PLAYTIME'S OVER, then have P2 choose Wind-Up Frog. Expected: Sid's DOUBLE PRIZES! gives 2 lore for each Toy character banished during P1's turn, including the opponent's Toy banished by the follow-up choice.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-17-sid-double-prizes", () =>
          import("./triage-2026-05-17-remaining.js").then(
            (module) => module.triage20260517SidDoublePrizesFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-17-under-the-sea-sing-together",
      name: "Triage 2026-05-17 - Under the Sea Sing Together",
      description:
        "Visual validation for R32, game mgUHtYhWrVFQd5P3zeL2GmY. P1 has Under the Sea in hand and ready Moana - Chosen by the Ocean plus Simba - Returned King in play. Expected: Sing Together 8 allows exerting both characters because their total cost is at least 8, then opposing low-strength characters go to the bottom of the deck.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-17-under-the-sea-sing-together", () =>
          import("./triage-2026-05-17-remaining.js").then(
            (module) => module.triage20260517UnderTheSeaSingTogetherFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-18-beyond-the-horizon-empty-hand",
      name: "Triage 2026-05-18 - Beyond the Horizon empty hand draw",
      description:
        "Visual validation for the Beyond the Horizon Sing Together report. P1 has only Beyond the Horizon in hand, two ready singers with total cost 8, and 3 known cards in deck. Use Sing Together, choose the self-only option, and confirm P1 draws 3 cards even though their hand is empty after the song is played.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-18-beyond-the-horizon-empty-hand", () =>
          import("./triage-2026-05-18-beyond-the-horizon-empty-hand.js").then(
            (module) => module.triage20260518BeyondTheHorizonEmptyHandFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-20-fergus-discard-location",
      name: "Triage 2026-05-20 - Fergus discard location",
      description:
        "Visual validation for Fergus - Outpost Builder JUST THE SPOT with no locations in hand. Quest with Fergus, accept JUST THE SPOT, then select Remote Inklands - Desert Ruins from discard. The location should be playable for free from discard.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-20-fergus-discard-location", () =>
          import("./triage-2026-05-20-fergus-discard-location.js").then(
            (module) => module.triage20260520FergusDiscardLocationFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-20-simba-cinderella-free-play",
      name: "Triage 2026-05-20 - Simba + Cinderella free play",
      description:
        "Visual validation for Cinderella - Resourceful Traveler after Simba - King in the Making plays a character for free. Activate Simba's Boost 3. Resolve TIMELY ALLIANCE by playing Mickey Mouse - True Friend from the revealed deck top. Then quest with Cinderella. Her THIS AND THAT optional prompt should appear and let you put Stitch - New Dog from the top of your deck into your inkwell facedown and exerted.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-20-simba-cinderella-free-play", () =>
          import("./triage-2026-05-20-simba-cinderella-free-play.js").then(
            (module) => module.triage20260520SimbaCinderellaFreePlayFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-22-woody-under-the-sea-toy-followup",
      name: "Triage 2026-05-22 - Woody Under the Sea Toy follow-up",
      description:
        "Replay mgIWIBbVtg8QePn6QTO6uDj turn 11 visual validation. P2 controls Woody - Jungle Guide and a damaged Wind-Up Frog - Sid's Toy. Woody's static +1 willpower keeps the 1-base-willpower Toy alive before Under the Sea resolves. P1 casts Under the Sea. Expected: Under the Sea moves Woody and the damaged low-strength Toy at the same time. Capture before/after board state and exact card instance IDs if any damaged 1-base-willpower Toy remains in play after Woody leaves.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-22-woody-under-the-sea-toy-followup", () =>
          import("./triage-2026-05-22-manual-validation.js").then(
            (module) => module.triage20260522WoodyUnderTheSeaToyFollowupFixture,
          ),
        ),
    },
    {
      id: "triage-2026-05-22-liquidator-turn-one-expectation",
      name: "Triage 2026-05-22 - Liquidator turn-one expectation",
      description:
        "Replay mgYDIn-sWpq2j3KQ4Dm3y6J turn 1 rules-expectation validation. P1 has only 1 ink and Liquidator - Iced Over in hand on the first player's turn. Expected: no legal play affordance appears because Liquidator costs 2 and UNDERDOG does not apply to the first player. If the simulator offers a free-play or alternative-cost path, capture the available move and open a targeted issue.",
      load: () =>
        loadAndValidateFixture("triage-2026-05-22-liquidator-turn-one-expectation", () =>
          import("./triage-2026-05-22-manual-validation.js").then(
            (module) => module.triage20260522LiquidatorTurnOneExpectationFixture,
          ),
        ),
    },
    {
      id: "set13-card-gallery",
      name: "Set 13 Card Gallery",
      description: "All Set 13 cards rendered face up in one browser fixture.",
      load: () =>
        loadAndValidateFixture("set13-card-gallery", () =>
          import("./set13-card-gallery.js").then((module) => module.set13CardGalleryFixture),
        ),
    },
    {
      id: "set13-actions-amber-steel",
      name: "Set 13 Actions - Amber and Steel",
      description:
        "Set 13 Actions - Amber and Steel. The chunk cards start in hand with 99 ink so reviewers can play each card and inspect play, modal, target, reveal, and resolution prompts. Vanilla set13 cards are intentionally excluded. Shared support cards on the board provide friendly and opposing characters, an item, a location, damage, discard piles, and known decks for manual validation. Cards in this chunk: If I Didn't Have You; I'm Never Not by Your Side; Besties, Assemble!; Nobody Like U; Look What You've Done; You Broke My Smolder; Windstorm.",
      load: () =>
        loadAndValidateFixture("set13-actions-amber-steel", () =>
          import("./set13-manual-validation.js").then(
            (module) => module.set13ActionsAmberSteelFixture,
          ),
        ),
    },
    {
      id: "set13-actions-amethyst-emerald",
      name: "Set 13 Actions - Amethyst and Emerald",
      description:
        "Set 13 Actions - Amethyst and Emerald. The chunk cards start in hand with 99 ink so reviewers can play each card and inspect play, modal, target, reveal, and resolution prompts. Vanilla set13 cards are intentionally excluded. Shared support cards on the board provide friendly and opposing characters, an item, a location, damage, discard piles, and known decks for manual validation. Cards in this chunk: With a Few Good Friends; One and Only; Protective Aura; Piercing Attack; Put That Thing Back; Scout Ahead.",
      load: () =>
        loadAndValidateFixture("set13-actions-amethyst-emerald", () =>
          import("./set13-manual-validation.js").then(
            (module) => module.set13ActionsAmethystEmeraldFixture,
          ),
        ),
    },
    {
      id: "set13-actions-ruby-sapphire",
      name: "Set 13 Actions - Ruby and Sapphire",
      description:
        "Set 13 Actions - Ruby and Sapphire. The chunk cards start in hand with 99 ink so reviewers can play each card and inspect play, modal, target, reveal, and resolution prompts. Vanilla set13 cards are intentionally excluded. Shared support cards on the board provide friendly and opposing characters, an item, a location, damage, discard piles, and known decks for manual validation. Cards in this chunk: RAHR!; Prophetic Vision; Power Surge; Startle.",
      load: () =>
        loadAndValidateFixture("set13-actions-ruby-sapphire", () =>
          import("./set13-manual-validation.js").then(
            (module) => module.set13ActionsRubySapphireFixture,
          ),
        ),
    },
    {
      id: "set13-items-locations",
      name: "Set 13 Items and Locations",
      description:
        "Set 13 Items and Locations. The chunk cards start in hand with 99 ink so reviewers can play each card and inspect play, modal, target, reveal, and resolution prompts. Vanilla set13 cards are intentionally excluded. Shared support cards on the board provide friendly and opposing characters, an item, a location, damage, discard piles, and known decks for manual validation. Cards in this chunk: Powhatan's Staff; Rapunzel's Tower - Taken by the Vine; Magical Hunny Staff; Ring of Stones - Taken by the Vine; My Adventure Book; Paradise Falls - Exotic Destination; Scream Canister; Bunch of Balloons; Carl's House - Flying High; Translation Collar; Big Book of Hunny; Discarded Armor.",
      load: () =>
        loadAndValidateFixture("set13-items-locations", () =>
          import("./set13-manual-validation.js").then(
            (module) => module.set13ItemsLocationsFixture,
          ),
        ),
    },
    {
      id: "set13-characters-amber-play",
      name: "Set 13 Characters - Amber play tests",
      description:
        "Set 13 Characters - Amber play tests. The chunk cards start in hand with 99 ink so reviewers can play each card and inspect play, modal, target, reveal, and resolution prompts. Vanilla set13 cards are intentionally excluded. Shared support cards on the board provide friendly and opposing characters, an item, a location, damage, discard piles, and known decks for manual validation. Cards in this chunk: Woody - Helping a Friend; Ming Lee - Proud Parent; Pocahontas - Guiding the Tribe; Rabbit - Hunny Paladin; Meilin Lee - Lead Vocalist; Miriam Mendelsohn - Ticket Holder; Meilin Lee - Lead Vocalist; Kocoum - Defender of the Tribe; Woody - Town Sheriff; Abby Park - Over the Top; Meilin Lee - Losing Control; 4*Town - Hottest Band of the Year; Mike Wazowski - Heroic Climber; The Horned King - Merciless Master; Kanga - Hunny Bard; Sulley - The New Boss; Mirabel Madrigal - Family Guardian; Ursula - Created by the Vine; Woody & Buzz Lightyear - Best Buddies; Sulley & Boo - Scare Buddies; The Madrigal Family - Every Generation; Lilo & Stitch - Fun-Loving Friends; Mike Wazowski - Heroic Climber; Lilo & Stitch - Fun-Loving Friends.",
      load: () =>
        loadAndValidateFixture("set13-characters-amber-play", () =>
          import("./set13-manual-validation.js").then(
            (module) => module.set13CharactersAmberPlayFixture,
          ),
        ),
    },
    {
      id: "set13-characters-amethyst-play",
      name: "Set 13 Characters - Amethyst play tests",
      description:
        "Set 13 Characters - Amethyst play tests. The chunk cards start in hand with 99 ink so reviewers can play each card and inspect play, modal, target, reveal, and resolution prompts. Vanilla set13 cards are intentionally excluded. Shared support cards on the board provide friendly and opposing characters, an item, a location, damage, discard piles, and known decks for manual validation. Cards in this chunk: Vixey - Expert Fisher; Morph - Little Imitator; Fflewddur Fflam - Luckless Bard; Winnie the Pooh - Hunny Archmage; Panic - Hammer Enthusiast; Meilin Lee - Superficially Obedient; Genie - Hard to Grasp; Pain - Running with Scissors; Ming Lee - Overprotective Parent; Merida - Wisp Conjurer; Mrs. Incredible - Created by the Vine; Pete - Created by the Vine; Hera - Created by the Vine; Morph - Little Imitator; Peter Pan - Playful Prankster; Aladdin & Genie - Mischievous Pals; Peter Pan & Tinker Bell - Fast Friends; Christopher Robin - Hunny Sage; Maleficent & Diablo - Evil Incarnate; Mrs. Incredible - Created by the Vine.",
      load: () =>
        loadAndValidateFixture("set13-characters-amethyst-play", () =>
          import("./set13-manual-validation.js").then(
            (module) => module.set13CharactersAmethystPlayFixture,
          ),
        ),
    },
    {
      id: "set13-characters-emerald-play",
      name: "Set 13 Characters - Emerald play tests",
      description:
        "Set 13 Characters - Emerald play tests. The chunk cards start in hand with 99 ink so reviewers can play each card and inspect play, modal, target, reveal, and resolution prompts. Vanilla set13 cards are intentionally excluded. Shared support cards on the board provide friendly and opposing characters, an item, a location, damage, discard piles, and known decks for manual validation. Cards in this chunk: Buzz Lightyear - Providing Cover; Rapunzel - Escaping the Tower; Rapunzel - Escaping the Tower; Carl Fredricksen - Loving Husband; Ellie Fredricksen - Loving Wife; Buzz Lightyear - Grounded; Gopher - Hunny Cook; Russell - Senior Wilderness Explorer; Rapunzel - Tower Defender; Roo - Hunny Rogue; Winifred - Exasperated Elephant; Kevin - Flightless Bird; Dr. Bushroot - Evil Botanist; Mother Gothel - Evil as Ever; Rapunzel - Escaping the Tower; Carl Fredricksen & Russell - Intrepid Explorers; Mickey Mouse & Minnie Mouse - Adventuring Duo; Rapunzel & Flynn Rider - Unlikely Pair; Peter Pan - Created by the Vine.",
      load: () =>
        loadAndValidateFixture("set13-characters-emerald-play", () =>
          import("./set13-manual-validation.js").then(
            (module) => module.set13CharactersEmeraldPlayFixture,
          ),
        ),
    },
    {
      id: "set13-characters-ruby-play",
      name: "Set 13 Characters - Ruby play tests",
      description:
        "Set 13 Characters - Ruby play tests. The chunk cards start in hand with 99 ink so reviewers can play each card and inspect play, modal, target, reveal, and resolution prompts. Vanilla set13 cards are intentionally excluded. Shared support cards on the board provide friendly and opposing characters, an item, a location, damage, discard piles, and known decks for manual validation. Cards in this chunk: Boo - Energetic Child; Carl Fredricksen - On the Move; Gaston - Created by the Vine; Colonel Hathi - On the March; Pacha - Panicked Customer; Sun Yee - Red Panda Spirit; Beast - Fierce Defender; Randall Boggs - Envious Coworker; Donald Duck - Vineling Rider; Meilin Lee - Popular Red Panda; Tigger - Hunny Barbarian; Boo - Energetic Child; Sulley - Protective Monster; Ming Lee - Giant Red Panda; Captain Hook - Conniving Pirate; Belle & Beast - Certain as the Sun; Meilin Lee - Popular Red Panda; Belle & Beast - Certain as the Sun.",
      load: () =>
        loadAndValidateFixture("set13-characters-ruby-play", () =>
          import("./set13-manual-validation.js").then(
            (module) => module.set13CharactersRubyPlayFixture,
          ),
        ),
    },
    {
      id: "set13-characters-sapphire-play",
      name: "Set 13 Characters - Sapphire play tests",
      description:
        "Set 13 Characters - Sapphire play tests. The chunk cards start in hand with 99 ink so reviewers can play each card and inspect play, modal, target, reveal, and resolution prompts. Vanilla set13 cards are intentionally excluded. Shared support cards on the board provide friendly and opposing characters, an item, a location, damage, discard piles, and known decks for manual validation. Cards in this chunk: Merlin - Envisioning the Future; Randall Boggs - Scary Smart; Belle - Always Reading; Randall Boggs - Scary Smart; Antonio Madrigal - Animal Doctor; Maid Marian - Created by the Vine; Boo - Human Child; Pluto - Suspicious Sentry; Charles Muntz - Obsessive Explorer; Darkwing Duck & Launchpad - St. Canard's Finest.",
      load: () =>
        loadAndValidateFixture("set13-characters-sapphire-play", () =>
          import("./set13-manual-validation.js").then(
            (module) => module.set13CharactersSapphirePlayFixture,
          ),
        ),
    },
    {
      id: "set13-characters-steel-play",
      name: "Set 13 Characters - Steel play tests",
      description:
        "Set 13 Characters - Steel play tests. The chunk cards start in hand with 99 ink so reviewers can play each card and inspect play, modal, target, reveal, and resolution prompts. Vanilla set13 cards are intentionally excluded. Shared support cards on the board provide friendly and opposing characters, an item, a location, damage, discard piles, and known decks for manual validation. Cards in this chunk: Maximus - Relentless Stallion; Willie the Giant - Created by the Vine; Sprout - Experiment 509; Megavolt - Electrical Menace; Darkwing Duck - Shadowy Superhero; Omnidroid - Scanning for Threats; Flynn Rider - High-Climbing Rogue; Mulan - Created by the Vine; Maximus - Relentless Stallion; Omnidroid - Ultimate Iteration; The Vine - Towering Stalk; Mulan - Created by the Vine.",
      load: () =>
        loadAndValidateFixture("set13-characters-steel-play", () =>
          import("./set13-manual-validation.js").then(
            (module) => module.set13CharactersSteelPlayFixture,
          ),
        ),
    },
    {
      id: "set13-characters-amber-board",
      name: "Set 13 Characters - Amber board tests",
      description:
        "Set 13 Characters - Amber board tests. The chunk cards start in play and ready so static, quest, challenge, activated, and board-state abilities can be inspected immediately. Vanilla set13 cards are intentionally excluded. Shared support cards on the board provide friendly and opposing characters, an item, a location, damage, discard piles, and known decks for manual validation. Cards in this chunk: Woody - Helping a Friend; Ming Lee - Proud Parent; Pocahontas - Guiding the Tribe; Rabbit - Hunny Paladin; Meilin Lee - Lead Vocalist; Miriam Mendelsohn - Ticket Holder; Meilin Lee - Lead Vocalist; Kocoum - Defender of the Tribe; Woody - Town Sheriff; Abby Park - Over the Top; Meilin Lee - Losing Control; 4*Town - Hottest Band of the Year; Mike Wazowski - Heroic Climber; The Horned King - Merciless Master; Kanga - Hunny Bard; Sulley - The New Boss; Mirabel Madrigal - Family Guardian; Ursula - Created by the Vine; Woody & Buzz Lightyear - Best Buddies; Sulley & Boo - Scare Buddies; The Madrigal Family - Every Generation; Lilo & Stitch - Fun-Loving Friends; Mike Wazowski - Heroic Climber; Lilo & Stitch - Fun-Loving Friends.",
      load: () =>
        loadAndValidateFixture("set13-characters-amber-board", () =>
          import("./set13-manual-validation.js").then(
            (module) => module.set13CharactersAmberBoardFixture,
          ),
        ),
    },
    {
      id: "set13-characters-amethyst-board",
      name: "Set 13 Characters - Amethyst board tests",
      description:
        "Set 13 Characters - Amethyst board tests. The chunk cards start in play and ready so static, quest, challenge, activated, and board-state abilities can be inspected immediately. Vanilla set13 cards are intentionally excluded. Shared support cards on the board provide friendly and opposing characters, an item, a location, damage, discard piles, and known decks for manual validation. Cards in this chunk: Vixey - Expert Fisher; Morph - Little Imitator; Fflewddur Fflam - Luckless Bard; Winnie the Pooh - Hunny Archmage; Panic - Hammer Enthusiast; Meilin Lee - Superficially Obedient; Genie - Hard to Grasp; Pain - Running with Scissors; Ming Lee - Overprotective Parent; Merida - Wisp Conjurer; Mrs. Incredible - Created by the Vine; Pete - Created by the Vine; Hera - Created by the Vine; Morph - Little Imitator; Peter Pan - Playful Prankster; Aladdin & Genie - Mischievous Pals; Peter Pan & Tinker Bell - Fast Friends; Christopher Robin - Hunny Sage; Maleficent & Diablo - Evil Incarnate; Mrs. Incredible - Created by the Vine.",
      load: () =>
        loadAndValidateFixture("set13-characters-amethyst-board", () =>
          import("./set13-manual-validation.js").then(
            (module) => module.set13CharactersAmethystBoardFixture,
          ),
        ),
    },
    {
      id: "set13-characters-emerald-board",
      name: "Set 13 Characters - Emerald board tests",
      description:
        "Set 13 Characters - Emerald board tests. The chunk cards start in play and ready so static, quest, challenge, activated, and board-state abilities can be inspected immediately. Vanilla set13 cards are intentionally excluded. Shared support cards on the board provide friendly and opposing characters, an item, a location, damage, discard piles, and known decks for manual validation. Cards in this chunk: Buzz Lightyear - Providing Cover; Rapunzel - Escaping the Tower; Rapunzel - Escaping the Tower; Carl Fredricksen - Loving Husband; Ellie Fredricksen - Loving Wife; Buzz Lightyear - Grounded; Gopher - Hunny Cook; Russell - Senior Wilderness Explorer; Rapunzel - Tower Defender; Roo - Hunny Rogue; Winifred - Exasperated Elephant; Kevin - Flightless Bird; Dr. Bushroot - Evil Botanist; Mother Gothel - Evil as Ever; Rapunzel - Escaping the Tower; Carl Fredricksen & Russell - Intrepid Explorers; Mickey Mouse & Minnie Mouse - Adventuring Duo; Rapunzel & Flynn Rider - Unlikely Pair; Peter Pan - Created by the Vine.",
      load: () =>
        loadAndValidateFixture("set13-characters-emerald-board", () =>
          import("./set13-manual-validation.js").then(
            (module) => module.set13CharactersEmeraldBoardFixture,
          ),
        ),
    },
    {
      id: "set13-characters-ruby-board",
      name: "Set 13 Characters - Ruby board tests",
      description:
        "Set 13 Characters - Ruby board tests. The chunk cards start in play and ready so static, quest, challenge, activated, and board-state abilities can be inspected immediately. Vanilla set13 cards are intentionally excluded. Shared support cards on the board provide friendly and opposing characters, an item, a location, damage, discard piles, and known decks for manual validation. Cards in this chunk: Boo - Energetic Child; Carl Fredricksen - On the Move; Gaston - Created by the Vine; Colonel Hathi - On the March; Pacha - Panicked Customer; Sun Yee - Red Panda Spirit; Beast - Fierce Defender; Randall Boggs - Envious Coworker; Donald Duck - Vineling Rider; Meilin Lee - Popular Red Panda; Tigger - Hunny Barbarian; Boo - Energetic Child; Sulley - Protective Monster; Ming Lee - Giant Red Panda; Captain Hook - Conniving Pirate; Belle & Beast - Certain as the Sun; Meilin Lee - Popular Red Panda; Belle & Beast - Certain as the Sun.",
      load: () =>
        loadAndValidateFixture("set13-characters-ruby-board", () =>
          import("./set13-manual-validation.js").then(
            (module) => module.set13CharactersRubyBoardFixture,
          ),
        ),
    },
    {
      id: "set13-characters-sapphire-board",
      name: "Set 13 Characters - Sapphire board tests",
      description:
        "Set 13 Characters - Sapphire board tests. The chunk cards start in play and ready so static, quest, challenge, activated, and board-state abilities can be inspected immediately. Vanilla set13 cards are intentionally excluded. Shared support cards on the board provide friendly and opposing characters, an item, a location, damage, discard piles, and known decks for manual validation. Cards in this chunk: Merlin - Envisioning the Future; Randall Boggs - Scary Smart; Belle - Always Reading; Randall Boggs - Scary Smart; Antonio Madrigal - Animal Doctor; Maid Marian - Created by the Vine; Boo - Human Child; Pluto - Suspicious Sentry; Charles Muntz - Obsessive Explorer; Darkwing Duck & Launchpad - St. Canard's Finest.",
      load: () =>
        loadAndValidateFixture("set13-characters-sapphire-board", () =>
          import("./set13-characters-sapphire-board.js").then(
            (module) => module.set13CharactersSapphireBoardFixture,
          ),
        ),
    },
    {
      id: "set13-characters-steel-board",
      name: "Set 13 Characters - Steel board tests",
      description:
        "Set 13 Characters - Steel board tests. The chunk cards start in play and ready so static, quest, challenge, activated, and board-state abilities can be inspected immediately. Vanilla set13 cards are intentionally excluded. Shared support cards on the board provide friendly and opposing characters, an item, a location, damage, discard piles, and known decks for manual validation. Cards in this chunk: Maximus - Relentless Stallion; Willie the Giant - Created by the Vine; Sprout - Experiment 509; Megavolt - Electrical Menace; Darkwing Duck - Shadowy Superhero; Omnidroid - Scanning for Threats; Flynn Rider - High-Climbing Rogue; Mulan - Created by the Vine; Maximus - Relentless Stallion; Omnidroid - Ultimate Iteration; The Vine - Towering Stalk; Mulan - Created by the Vine.",
      load: () =>
        loadAndValidateFixture("set13-characters-steel-board", () =>
          import("./set13-manual-validation.js").then(
            (module) => module.set13CharactersSteelBoardFixture,
          ),
        ),
    },
    {
      id: "set13-selected-characters-fullness",
      name: "Set 13 Selected Characters - Fullness Setup",
      description:
        "Targeted visual setup for Carl Fredricksen - On the Move, Mother Gothel - Evil as Ever, Maleficent & Diablo - Evil Incarnate, Merida - Wisp Conjurer, The Horned King - Merciless Master, Sulley & Boo - Scare Buddies, and Woody - Helping a Friend.",
      load: () =>
        loadAndValidateFixture("set13-selected-characters-fullness", () =>
          import("./set13-selected-characters-fullness.js").then(
            (module) => module.set13SelectedCharactersFullnessFixture,
          ),
        ),
    },
  ] satisfies LorcanaFixtureLoaderEntry[],
  "general simulator fixture loaders",
);

export const LORCANA_SIMULATOR_FIXTURE_MANIFEST = fixtureLoaderRegistry.manifest;
export const LORCANA_SIMULATOR_FIXTURE_MANIFEST_BY_ID: Record<string, FixtureManifestEntry> =
  Object.fromEntries(LORCANA_SIMULATOR_FIXTURE_MANIFEST.map((entry) => [entry.id, entry]));
export const LORCANA_SIMULATOR_FIXTURE_LOADERS = fixtureLoaderRegistry.loaderById;

export function isKnownLorcanaFixtureId(fixtureId: string): boolean {
  return fixtureLoaderRegistry.loaderById.has(fixtureId);
}

export async function loadLorcanaFixture(
  fixtureId: string,
): Promise<LorcanaSimulatorFixture | undefined> {
  return fixtureLoaderRegistry.loaderById.get(fixtureId)?.();
}

export async function loadLorcanaFixtureOrDefault(
  fixtureId: string,
): Promise<LorcanaSimulatorFixture> {
  const fixture = await loadLorcanaFixture(fixtureId);
  if (fixture) {
    return fixture;
  }

  const defaultFixture = await loadLorcanaFixture(DEFAULT_LORCANA_FIXTURE_ID);
  if (!defaultFixture) {
    throw new Error(`Default fixture "${DEFAULT_LORCANA_FIXTURE_ID}" not found`);
  }

  return defaultFixture;
}

export const getLorcanaFixture = loadLorcanaFixtureOrDefault;

/**
 * Helper to get card display name from a card definition
 */
export const getCardDisplayName = (card: { name: string; version?: string }): string => {
  if (card.version) {
    return `${card.name} - ${card.version}`;
  }
  return card.name;
};
