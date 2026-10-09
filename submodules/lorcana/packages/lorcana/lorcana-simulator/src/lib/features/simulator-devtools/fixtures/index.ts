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
      id: "optional-effect-not-used",
      name: "Optional effect without payment",
      description:
        "Play Max Goof with three ready ink. Check that his unavailable optional payment does not appear as a player choosing No in the log.",
      load: () =>
        loadAndValidateFixture("optional-effect-not-used", () =>
          import("./optional-effect-not-used.js").then(
            (module) => module.optionalEffectNotUsedFixture,
          ),
        ),
    },
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
      id: "user-reports-meilin-sing-together",
      name: "User Report QA - Meilin Sing Together",
      description:
        "Manual QA for Meilin - Lead Vocalist with the real Under the Sea and Circle of Life cards.",
      load: () =>
        loadAndValidateFixture("user-reports-meilin-sing-together", () =>
          import("./user-report-fixes.js").then(
            (module) => module.userReportsMeilinSingTogetherFixture,
          ),
        ),
    },
    {
      id: "user-reports-darkwing-launchpad-shift",
      name: "User Report QA - Darkwing and Launchpad Shift",
      description:
        "Manual QA for shifting St. Canard's Finest onto Darkwing Duck, Launchpad, or Morph.",
      load: () =>
        loadAndValidateFixture("user-reports-darkwing-launchpad-shift", () =>
          import("./user-report-fixes.js").then(
            (module) => module.userReportsDarkwingLaunchpadShiftFixture,
          ),
        ),
    },
    {
      id: "user-reports-mickey-minnie-duo-shift",
      name: "User Report QA - Mickey and Minnie Duo Shift",
      description:
        "Manual QA for Duo Shift state inheritance and moving the complete stack to the inkwell.",
      load: () =>
        loadAndValidateFixture("user-reports-mickey-minnie-duo-shift", () =>
          import("./user-report-fixes.js").then(
            (module) => module.userReportsMickeyMinnieDuoShiftFixture,
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
      id: "set14-audit-entry-damage",
      name: "Hyperia audit: entry-damage",
      description: "Focused Hyperia card audit with playable decks and prerequisites.",
      load: () =>
        loadAndValidateFixture("set14-audit-entry-damage", () =>
          import("./set14-audit-regressions.js").then(
            (module) => module.set14AuditEntryDamageFixture,
          ),
        ),
    },
    {
      id: "set14-audit-torn-corner",
      name: "Hyperia audit: torn-corner",
      description: "Focused Hyperia card audit with playable decks and prerequisites.",
      load: () =>
        loadAndValidateFixture("set14-audit-torn-corner", () =>
          import("./set14-audit-regressions.js").then(
            (module) => module.set14AuditTornCornerFixture,
          ),
        ),
    },
    {
      id: "set14-audit-payment",
      name: "Hyperia audit: payment",
      description: "Focused Hyperia card audit with playable decks and prerequisites.",
      load: () =>
        loadAndValidateFixture("set14-audit-payment", () =>
          import("./set14-audit-regressions.js").then((module) => module.set14AuditPaymentFixture),
        ),
    },
    {
      id: "set14-audit-aurora",
      name: "Hyperia audit: Aurora current-turn song",
      description: "Focused printed-text and target-legality regression.",
      load: () =>
        loadAndValidateFixture("set14-audit-aurora", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditAuroraFixture),
        ),
    },
    {
      id: "set14-audit-next-ready",
      name: "Hyperia audit: next-start ready and mill batches",
      description: "Target-only next-start freeze, main-phase readying and deck-discard lore.",
      load: () =>
        loadAndValidateFixture("set14-audit-next-ready", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditNextReadyFixture),
        ),
    },
    {
      id: "set14-audit-ruby-vanilla",
      name: "Hyperia audit: Ruby vanilla characters",
      description: "Abigail, Pepita and Stacey play, drying, quest, challenge and logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-ruby-vanilla", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditRubyVanillaFixture),
        ),
    },
    {
      id: "set14-audit-donald-taxi",
      name: "Hyperia audit: Donald Taxi Driver",
      description: "Chosen Rush, drying restrictions, challenge damage and public logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-donald-taxi", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditDonaldTaxiFixture),
        ),
    },
    {
      id: "set14-audit-goofy-tourist",
      name: "Hyperia audit: Goofy Enthusiastic Tourist",
      description: "Conditional Singer strength, combat and last-Singer removal.",
      load: () =>
        loadAndValidateFixture("set14-audit-goofy-tourist", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditGoofyTouristFixture),
        ),
    },
    {
      id: "set14-audit-tadashi",
      name: "Hyperia audit: Tadashi Making Waves",
      description: "Banishment rewards, controller ownership, ink-drop payment and logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-tadashi", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditTadashiFixture),
        ),
    },
    {
      id: "set14-audit-cruella",
      name: "Hyperia audit: Cruella Dodging Traffic",
      description: "Printed Rush, legal defenders, drying quest limits, damage and logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-cruella", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditCruellaFixture),
        ),
    },
    {
      id: "set14-audit-torn-memories",
      name: "Hyperia audit: The Torn Corner Fond Memories",
      description:
        "Nine/ten-card draw threshold, free-play identity, immediate activation and logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-torn-memories", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditTornMemoriesFixture),
        ),
    },
    {
      id: "set14-audit-jukebox-player-two",
      name: "Hyperia audit: Jukebox player-two",
      description: "Jukebox text-box boundary.",
      load: () =>
        loadAndValidateFixture("set14-audit-jukebox-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditJukeboxPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-jukebox-ready-boundary",
      name: "Hyperia audit: Jukebox ready-boundary",
      description: "Jukebox text-box boundary.",
      load: () =>
        loadAndValidateFixture("set14-audit-jukebox-ready-boundary", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditJukeboxReadyBoundaryFixture,
          ),
        ),
    },
    {
      id: "set14-audit-jukebox-no-targets",
      name: "Hyperia audit: Jukebox no-targets",
      description: "Jukebox text-box boundary.",
      load: () =>
        loadAndValidateFixture("set14-audit-jukebox-no-targets", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditJukeboxNoTargetsFixture),
        ),
    },
    {
      id: "set14-audit-jukebox-no-match",
      name: "Hyperia audit: Jukebox no-match",
      description: "Jukebox text-box boundary.",
      load: () =>
        loadAndValidateFixture("set14-audit-jukebox-no-match", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditJukeboxNoMatchFixture),
        ),
    },
    {
      id: "set14-audit-jukebox-late-match",
      name: "Hyperia audit: Jukebox late-match",
      description: "Jukebox text-box boundary.",
      load: () =>
        loadAndValidateFixture("set14-audit-jukebox-late-match", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditJukeboxLateMatchFixture),
        ),
    },
    {
      id: "set14-audit-jukebox-removed-match",
      name: "Hyperia audit: Jukebox removed-match",
      description: "Jukebox text-box boundary.",
      load: () =>
        loadAndValidateFixture("set14-audit-jukebox-removed-match", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditJukeboxRemovedMatchFixture,
          ),
        ),
    },
    {
      id: "set14-audit-jukebox",
      name: "Hyperia audit: Jukebox",
      description: "Matching song, ready choice, Ward, once-per-turn, expiry and logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-jukebox", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditJukeboxFixture),
        ),
    },
    {
      id: "set14-audit-omalley",
      name: "Hyperia audit: Thomas O'Malley Savvy Vagabond",
      description: "Top-card reveal, highest cost to owner hand and losing card to bottom.",
      load: () =>
        loadAndValidateFixture("set14-audit-omalley", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditOmalleyFixture),
        ),
    },
    {
      id: "set14-audit-duchess",
      name: "Hyperia audit: Duchess Cosmopolitan Cat",
      description: "Highest character cost, immediate lore bonus removal and private deck choice.",
      load: () =>
        loadAndValidateFixture("set14-audit-duchess", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditDuchessFixture),
        ),
    },
    {
      id: "set14-audit-judy-daycamp",
      name: "Hyperia audit: Judy Hopps Day Camp Instructor",
      description: "Prior character play, optional exerted ink and Support strength expiry.",
      load: () =>
        loadAndValidateFixture("set14-audit-judy-daycamp", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditJudyDayCampFixture),
        ),
    },
    {
      id: "set14-audit-minnie",
      name: "Hyperia audit: Minnie Mouse Urban Visionary",
      description: "Separate private look and return choices; ink exertion after either choice.",
      load: () =>
        loadAndValidateFixture("set14-audit-minnie", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMinnieFixture),
        ),
    },
    {
      id: "set14-audit-spyglass-empty",
      name: "Hyperia audit: Spyglass empty hand",
      description: "Spyglass Hat boundary browser validation.",
      load: () =>
        loadAndValidateFixture("set14-audit-spyglass-empty", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditSpyglassEmptyFixture),
        ),
    },
    {
      id: "set14-audit-spyglass-pair",
      name: "Hyperia audit: two Spyglass Hats",
      description: "Spyglass Hat boundary browser validation.",
      load: () =>
        loadAndValidateFixture("set14-audit-spyglass-pair", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditSpyglassPairFixture),
        ),
    },
    {
      id: "set14-audit-chem-purse-reveal",
      name: "Hyperia audit: Purse player-two short reveal",
      description: "Short item deck reveal, decline and other-copy cost.",
      load: () =>
        loadAndValidateFixture("set14-audit-chem-purse-reveal", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditChemPurseRevealFixture),
        ),
    },
    {
      id: "set14-audit-chem-purse-short",
      name: "Hyperia audit: Purse short nonitem deck",
      description: "Player-two short deck and no-item boundary.",
      load: () =>
        loadAndValidateFixture("set14-audit-chem-purse-short", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditChemPurseShortFixture),
        ),
    },
    {
      id: "set14-audit-chem-purse-empty",
      name: "Hyperia audit: Purse empty deck",
      description: "Empty deck cost and short nonitem deck boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-chem-purse-empty", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditChemPurseEmptyFixture),
        ),
    },
    {
      id: "set14-audit-chem-purse-play",
      name: "Hyperia audit: Chem Purse play and ink",
      description: "Normal play, inking and exerted activation.",
      load: () =>
        loadAndValidateFixture("set14-audit-chem-purse-play", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditChemPursePlayFixture),
        ),
    },
    {
      id: "set14-audit-chem-purse",
      name: "Hyperia audit: Upgraded Chem Purse",
      description: "Other-item activation cost, optional reveal and private deck ordering.",
      load: () =>
        loadAndValidateFixture("set14-audit-chem-purse", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditChemPurseFixture),
        ),
    },
    {
      id: "set14-audit-edgar-play",
      name: "Hyperia audit: Edgar play quest and ink",
      description: "Normal play, drying, quest and inking.",
      load: () =>
        loadAndValidateFixture("set14-audit-edgar-play", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditEdgarPlayFixture),
        ),
    },
    {
      id: "set14-audit-edgar-damage-kinds",
      name: "Hyperia audit: Edgar damage kinds",
      description: "Put and move damage plus extra Resist.",
      load: () =>
        loadAndValidateFixture("set14-audit-edgar-damage-kinds", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditEdgarDamageKindsFixture),
        ),
    },
    {
      id: "set14-audit-edgar",
      name: "Hyperia audit: Edgar Balthazar",
      description: "Conditional Resist damage reduction and restoration after healing.",
      load: () =>
        loadAndValidateFixture("set14-audit-edgar", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditEdgarFixture),
        ),
    },
    {
      id: "set14-audit-kit-courier",
      name: "Hyperia audit: Kit Cloudkicker Courier",
      description: "Vanilla play, drying, quest, ink and simultaneous challenge damage.",
      load: () =>
        loadAndValidateFixture("set14-audit-kit-courier", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditKitCourierFixture),
        ),
    },
    {
      id: "set14-audit-tick-tock",
      name: "Hyperia audit: Tick-Tock",
      description: "Vanilla eight-ink play, three-lore quest and nine-damage challenge.",
      load: () =>
        loadAndValidateFixture("set14-audit-tick-tock", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditTickTockFixture),
        ),
    },
    {
      id: "set14-audit-tiana",
      name: "Hyperia audit: Tiana Restauranteur",
      description:
        "Optional draw then required discard; retained card privacy and duplicate choices.",
      load: () =>
        loadAndValidateFixture("set14-audit-tiana", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditTianaFixture),
        ),
    },
    {
      id: "set14-audit-tiana-empty",
      name: "Hyperia audit: Tiana empty deck",
      description: "Required discard after an empty-deck draw and end-of-turn loss.",
      load: () =>
        loadAndValidateFixture("set14-audit-tiana-empty", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditTianaEmptyFixture),
        ),
    },
    {
      id: "set14-audit-sir-ector-negative",
      name: "Hyperia audit: Sir Ector no reward",
      description: "Sir Ector reward boundary.",
      load: () =>
        loadAndValidateFixture("set14-audit-sir-ector-negative", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditSirEctorNegativeFixture),
        ),
    },
    {
      id: "set14-audit-sir-ector-empty",
      name: "Hyperia audit: Sir Ector empty deck",
      description: "Sir Ector reward boundary.",
      load: () =>
        loadAndValidateFixture("set14-audit-sir-ector-empty", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditSirEctorEmptyFixture),
        ),
    },
    {
      id: "set14-audit-khan-delivery",
      name: "Hyperia audit: Khan Transport Delivery",
      description: "Draw, drop gain, payment, non-inkable controls and empty deck.",
      load: () =>
        loadAndValidateFixture("set14-audit-khan-delivery", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditKhanDeliveryFixture),
        ),
    },
    {
      id: "set14-audit-people-no-location",
      name: "Hyperia audit: People song without a playable location",
      description: "No own hand or discard location; existing location must not receive singer.",
      load: () =>
        loadAndValidateFixture("set14-audit-people-no-location", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditPeopleNoLocationFixture),
        ),
    },
    {
      id: "set14-audit-people-ownership",
      name: "Hyperia audit: People song exact owner and destination",
      description: "Mandatory location selection, duplicate destination and chooser privacy.",
      load: () =>
        loadAndValidateFixture("set14-audit-people-ownership", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditPeopleOwnershipFixture),
        ),
    },
    {
      id: "set14-audit-people-gonna-come-here",
      name: "Hyperia audit: People Gonna Come Here",
      description: "Free location from hand or discard, singer movement and decline.",
      load: () =>
        loadAndValidateFixture("set14-audit-people-gonna-come-here", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditPeopleGonnaComeHereFixture,
          ),
        ),
    },
    {
      id: "set14-audit-express-removal",
      name: "Hyperia audit: Express source removal",
      description: "Willpower loss and lethal damage after item banishment.",
      load: () =>
        loadAndValidateFixture("set14-audit-express-removal", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditExpressRemovalFixture),
        ),
    },
    {
      id: "set14-audit-express-player-two",
      name: "Hyperia audit: Express player-two copies and source removal",
      description: "Exact free movement and stacked source-removal boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-express-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditExpressPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-hyperia-city-express",
      name: "Hyperia audit: Hyperia City Express",
      description: "Free movement, item exertion and Hyperia City willpower bonus.",
      load: () =>
        loadAndValidateFixture("set14-audit-hyperia-city-express", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditHyperiaCityExpressFixture),
        ),
    },
    {
      id: "set14-audit-plane-drying",
      name: "Hyperia audit: Alert does not bypass drying",
      description: "Alert plus Fresh Ink challenge restriction.",
      load: () =>
        loadAndValidateFixture("set14-audit-plane-drying", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditPlaneDryingFixture),
        ),
    },
    {
      id: "set14-audit-plane-copies",
      name: "Hyperia audit: Pirate Plane exact copies",
      description: "Printed ability boundary audit.",
      load: () =>
        loadAndValidateFixture("set14-audit-plane-copies", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditPlaneCopiesFixture),
        ),
    },
    {
      id: "set14-audit-plane-no-target",
      name: "Hyperia audit: Pirate Plane no legal target",
      description: "Printed ability boundary audit.",
      load: () =>
        loadAndValidateFixture("set14-audit-plane-no-target", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditPlaneNoTargetFixture),
        ),
    },
    {
      id: "set14-audit-pirate-plane",
      name: "Hyperia audit: Pirate Plane",
      description: "Optional damage, Ward, Resist and Alert challenge legality.",
      load: () =>
        loadAndValidateFixture("set14-audit-pirate-plane", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditPiratePlaneFixture),
        ),
    },
    {
      id: "set14-audit-miguel-street-player-two",
      name: "Hyperia audit: Street Miguel player-two Singer boundary",
      description: "Own-discard bonus quest and Singer three versus four without spending ink.",
      load: () =>
        loadAndValidateFixture("set14-audit-miguel-street-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditMiguelStreetPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-miguel-street",
      name: "Hyperia audit: Miguel Street Musician",
      description: "Live Singer and lore bonuses from own song discard.",
      load: () =>
        loadAndValidateFixture("set14-audit-miguel-street", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMiguelStreetFixture),
        ),
    },
    {
      id: "set14-audit-russell-order-player-two",
      name: "Hyperia audit: Russell player-two natural bottom draws",
      description:
        "Two-card order through actual draws, public reveal, one-card and empty-deck activation.",
      load: () =>
        loadAndValidateFixture("set14-audit-russell-order-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditRussellOrderPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-russell-ordering",
      name: "Hyperia audit: Russell bottom ordering",
      description: "Two publicly revealed non-characters and bottom order.",
      load: () =>
        loadAndValidateFixture("set14-audit-russell-ordering", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditRussellOrderingFixture),
        ),
    },
    {
      id: "set14-audit-aurora-player-two",
      name: "Hyperia audit: player-two Aurora",
      description: "Cost-three recovery, repeated entry and end-turn lore.",
      load: () =>
        loadAndValidateFixture("set14-audit-aurora-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditAuroraPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-aurora-sung",
      name: "Hyperia audit: Aurora sung-song recovery",
      description: "Sung-song recovery and own end-turn lore.",
      load: () =>
        loadAndValidateFixture("set14-audit-aurora-sung", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditAuroraSungFixture),
        ),
    },
    {
      id: "set14-audit-lionheart-mayor-player-two",
      name: "Hyperia audit: Lionheart Mayor Player Two",
      description:
        "Self/opposing lore, stacked independent copies, expiry and Bodyguard protection.",
      load: () =>
        loadAndValidateFixture("set14-audit-lionheart-mayor-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditLionheartMayorPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-lionheart-mayor",
      name: "Hyperia audit: Lionheart Incumbent Mayor",
      description: "Up to two lore targets, questing and end-turn expiry.",
      load: () =>
        loadAndValidateFixture("set14-audit-lionheart-mayor", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditLionheartMayorFixture),
        ),
    },
    {
      id: "set14-audit-powerline-player-two",
      name: "Hyperia audit: player-two Powerline",
      description: "Repeat-turn Singer recovery and public logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-powerline-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditPowerlinePlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-powerline-recovery",
      name: "Hyperia audit: Powerline",
      description: "Singer recovery and live lore per friendly Singer.",
      load: () =>
        loadAndValidateFixture("set14-audit-powerline-recovery", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditPowerlineRecoveryFixture),
        ),
    },
    {
      id: "set14-audit-elisa-player-two",
      name: "Hyperia audit: Elisa Player Two",
      description:
        "Controller-owned discard choices, repeated reveals and character-only completion.",
      load: () =>
        loadAndValidateFixture("set14-audit-elisa-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditElisaPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-elisa-empty-player-two",
      name: "Hyperia audit: Elisa negative and empty hand",
      description: "Opposing/self Detective exclusion and empty-hand completion.",
      load: () =>
        loadAndValidateFixture("set14-audit-elisa-empty-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditElisaEmptyPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-elisa",
      name: "Hyperia audit: Elisa Maza",
      description: "Reveal an opposing hand and choose a non-character discard.",
      load: () =>
        loadAndValidateFixture("set14-audit-elisa", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditElisaFixture),
        ),
    },
    {
      id: "set14-audit-clawhauser-player-two",
      name: "Hyperia audit: Clawhauser Player Two",
      description: "Reversed-seat play restriction, ready/exerted Bodyguard entry and turn reset.",
      load: () =>
        loadAndValidateFixture("set14-audit-clawhauser-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditClawhauserPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-clawhauser",
      name: "Hyperia audit: Clawhauser",
      description: "Own-turn character play restriction and Bodyguard entry.",
      load: () =>
        loadAndValidateFixture("set14-audit-clawhauser", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditClawhauserFixture),
        ),
    },
    {
      id: "set14-audit-nick-toy-drive-player-two",
      name: "Hyperia audit: Nick Toy Drive Player Two",
      description: "Support decline, action exclusion, reversed-seat draw and next-turn reset.",
      load: () =>
        loadAndValidateFixture("set14-audit-nick-toy-drive-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditNickToyDrivePlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-nick-toy-drive",
      name: "Hyperia audit: Nick Toy Drive",
      description: "Support and own-turn character threshold draw.",
      load: () =>
        loadAndValidateFixture("set14-audit-nick-toy-drive", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditNickToyDriveFixture),
        ),
    },
    {
      id: "set14-audit-manchas-player-two",
      name: "Hyperia audit: Manchas Player Two",
      description:
        "Action exclusion, discount consumption, unused expiry and reversed-seat ownership.",
      load: () =>
        loadAndValidateFixture("set14-audit-manchas-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditManchasPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-manchas-discount",
      name: "Hyperia audit: Manchas discount",
      description: "Stacked next-character discount and consumption.",
      load: () =>
        loadAndValidateFixture("set14-audit-manchas-discount", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditManchasDiscountFixture),
        ),
    },
    {
      id: "set14-audit-pj-pete-player-two",
      name: "Hyperia audit: P.J. Pete Player Two",
      description: "Multiple Singers, exact Pete copies and immediate last-Singer bonus loss.",
      load: () =>
        loadAndValidateFixture("set14-audit-pj-pete-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditPjPetePlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-pj-pete",
      name: "Hyperia audit: P.J. Pete",
      description: "Live Singer lore bonus.",
      load: () =>
        loadAndValidateFixture("set14-audit-pj-pete", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditPjPeteFixture),
        ),
    },
    {
      id: "set14-audit-nick-harbormaster-player-two",
      name: "Hyperia audit: Nick Harbormaster Player Two",
      description:
        "Decline, exerted/fresh Shift inheritance and owner-relative Adventurous expiry.",
      load: () =>
        loadAndValidateFixture("set14-audit-nick-harbormaster-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditNickHarbormasterPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-nick-harbormaster",
      name: "Hyperia audit: Nick Harbormaster",
      description: "Shift and Adventurous restrictions.",
      load: () =>
        loadAndValidateFixture("set14-audit-nick-harbormaster", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditNickHarbormasterFixture),
        ),
    },
    {
      id: "set14-audit-miguel-player-two",
      name: "Hyperia audit: Miguel Player Two Sing Together",
      description:
        "Exact participating copies, other-singer exclusion and repeated Player Two reward.",
      load: () =>
        loadAndValidateFixture("set14-audit-miguel-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMiguelPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-miguel-singing",
      name: "Hyperia audit: Miguel singing",
      description: "Paid song other singer and repeated self singing.",
      load: () =>
        loadAndValidateFixture("set14-audit-miguel-singing", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMiguelSingingFixture),
        ),
    },
    {
      id: "set14-audit-judy-player-two",
      name: "Hyperia audit: Judy Player Two healing and undamaged board",
      description: "Exact opposing and capped own healing, then undamaged-only completion.",
      load: () =>
        loadAndValidateFixture("set14-audit-judy-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditJudyPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-judy-healing",
      name: "Hyperia audit: Judy healing",
      description: "Zero healing and damage cap.",
      load: () =>
        loadAndValidateFixture("set14-audit-judy-healing", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditJudyHealingFixture),
        ),
    },
    {
      id: "set14-audit-yax",
      name: "Hyperia audit: Yax",
      description: "Vanilla actions and logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-yax", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditYaxFixture),
        ),
    },
    {
      id: "set14-audit-priya-player-two",
      name: "Hyperia audit: Priya Player Two combined reductions",
      description: "Stacked accepted effects, self target and exact next-owner-turn expiry.",
      load: () =>
        loadAndValidateFixture("set14-audit-priya-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditPriyaPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-priya-duration",
      name: "Hyperia audit: Priya duration",
      description: "Optional reduction and next-owner-turn expiry.",
      load: () =>
        loadAndValidateFixture("set14-audit-priya-duration", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditPriyaDurationFixture),
        ),
    },
    {
      id: "set14-audit-miriam-player-two",
      name: "Hyperia audit: Miriam Player Two Support chain",
      description: "Other-character targeting, exact copies and modified strength for Player Two.",
      load: () =>
        loadAndValidateFixture("set14-audit-miriam-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMiriamPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-miriam-support",
      name: "Hyperia audit: Miriam Support",
      description: "Support acceptance decline and expiry.",
      load: () =>
        loadAndValidateFixture("set14-audit-miriam-support", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMiriamSupportFixture),
        ),
    },
    {
      id: "set14-audit-pete-multiple-guards",
      name: "Hyperia audit: Pete multiple Bodyguards and readiness",
      description: "Independent Bodyguards, natural readying and protection until both leave.",
      load: () =>
        loadAndValidateFixture("set14-audit-pete-multiple-guards", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditPeteMultipleGuardsFixture),
        ),
    },
    {
      id: "set14-audit-pete-bodyguard",
      name: "Hyperia audit: Pete Bodyguard",
      description: "Bodyguard entry and challenge targeting.",
      load: () =>
        loadAndValidateFixture("set14-audit-pete-bodyguard", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditPeteBodyguardFixture),
        ),
    },
    {
      id: "set14-audit-gazelle-player-two",
      name: "Hyperia audit: Gazelle Player Two Singer states",
      description: "Player Two Singer 4, drying/exerted restrictions and zero-ink singing.",
      load: () =>
        loadAndValidateFixture("set14-audit-gazelle-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditGazellePlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-gazelle-pop-diva",
      name: "Hyperia audit: Gazelle Pop Diva",
      description: "Singer 4 with healing and cost-five boundary.",
      load: () =>
        loadAndValidateFixture("set14-audit-gazelle-pop-diva", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditGazellePopDivaFixture),
        ),
    },
    {
      id: "set14-audit-max-music-player-two",
      name: "Hyperia audit: Max Music Lover Player Two",
      description: "Player Two Singer limit, independent copies and live lore ownership.",
      load: () =>
        loadAndValidateFixture("set14-audit-max-music-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMaxMusicPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-max-music-lover",
      name: "Hyperia audit: Max Goof Music Lover",
      description: "Singer 5 and live Best Night Ever lore bonus.",
      load: () =>
        loadAndValidateFixture("set14-audit-max-music-lover", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMaxMusicLoverFixture),
        ),
    },
    {
      id: "set14-audit-fru-fru",
      name: "Hyperia audit: Fru Fru",
      description: "Fru Fru printed properties and vanilla public actions.",
      load: () =>
        loadAndValidateFixture("set14-audit-fru-fru", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditFruFruFixture),
        ),
    },
    {
      id: "set14-audit-abuelita",
      name: "Hyperia audit: Abuelita",
      description: "Abuelita printed properties and vanilla public actions.",
      load: () =>
        loadAndValidateFixture("set14-audit-abuelita", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditAbuelitaFixture),
        ),
    },
    {
      id: "set14-audit-song-pending-choice",
      name: "Hyperia audit: song during pending choice",
      description: "Wildcat's optional entry choice blocks singing until resolution.",
      load: () =>
        loadAndValidateFixture("set14-audit-song-pending-choice", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditSongPendingChoiceFixture),
        ),
    },
    {
      id: "set14-audit-song-no-singer",
      name: "Hyperia audit: restricted song without a singer",
      description: "Toulouse restriction with invalid singer candidates.",
      load: () =>
        loadAndValidateFixture("set14-audit-song-no-singer", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditSongNoSingerFixture),
        ),
    },
    {
      id: "set14-audit-song-eligible-singer",
      name: "Hyperia audit: restricted song with a singer",
      description: "Toulouse restriction with ready eligible Koslov.",
      load: () =>
        loadAndValidateFixture("set14-audit-song-eligible-singer", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditSongEligibleSingerFixture),
        ),
    },
    {
      id: "set14-audit-challenge-payment",
      name: "Hyperia audit: payable challenge restriction",
      description: "Compare RC's payable and unpaid challenge restriction reasons.",
      load: () =>
        loadAndValidateFixture("set14-audit-challenge-payment", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditChallengePaymentFixture),
        ),
    },
    {
      id: "set14-audit-challenge-aura",
      name: "Hyperia audit: challenge aura restriction",
      description: "Jafar blocks Koslov until the aura source is banished.",
      load: () =>
        loadAndValidateFixture("set14-audit-challenge-aura", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditChallengeAuraFixture),
        ),
    },
    {
      id: "set14-audit-iconic-cinderella-duplicates",
      name: "Hyperia audit: Iconic Cinderella duplicate deck cards",
      description: "Separate duplicate instances between deck and private ink.",
      load: () =>
        loadAndValidateFixture("set14-audit-iconic-cinderella-duplicates", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditIconicCinderellaDuplicatesFixture,
          ),
        ),
    },
    {
      id: "set14-audit-iconic-cinderella-empty",
      name: "Hyperia audit: Iconic Cinderella empty deck",
      description: "End-turn empty deck ends the game before a card choice.",
      load: () =>
        loadAndValidateFixture("set14-audit-iconic-cinderella-empty", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditIconicCinderellaEmptyFixture,
          ),
        ),
    },
    {
      id: "set14-audit-iconic-cinderella-shift-payment",
      name: "Hyperia audit: Iconic Cinderella failed Shift payment",
      description: "Four-ink rejection and combined drying exertion inheritance.",
      load: () =>
        loadAndValidateFixture("set14-audit-iconic-cinderella-shift-payment", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditIconicCinderellaShiftPaymentFixture,
          ),
        ),
    },
    {
      id: "set14-audit-iconic-cinderella-shift-states",
      name: "Hyperia audit: Iconic Cinderella inherited Shift states",
      description: "Shift inherits drying and exertion without refreshing the character.",
      load: () =>
        loadAndValidateFixture("set14-audit-iconic-cinderella-shift-states", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditIconicCinderellaShiftStatesFixture,
          ),
        ),
    },
    {
      id: "set14-audit-iconic-cinderella-shift",
      name: "Hyperia audit: Iconic Cinderella Shift",
      description:
        "Shift five ink onto ready damaged Cinderella and quest immediately; reload for normal seven-ink play.",
      load: () =>
        loadAndValidateFixture("set14-audit-iconic-cinderella-shift", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditIconicCinderellaShiftFixture,
          ),
        ),
    },
    {
      id: "set14-audit-iconic-cinderella",
      name: "Hyperia audit: Iconic Cinderella",
      description: "Optional top or bottom split with private facedown exerted ink.",
      load: () =>
        loadAndValidateFixture("set14-audit-iconic-cinderella", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditIconicCinderellaFixture),
        ),
    },
    {
      id: "set14-audit-iconic-cinderella-short",
      name: "Hyperia audit: Iconic Cinderella short deck",
      description: "One-card Bespoke Design can retain the card without adding ink.",
      load: () =>
        loadAndValidateFixture("set14-audit-iconic-cinderella-short", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditIconicCinderellaShortFixture,
          ),
        ),
    },
    {
      id: "set14-audit-iconic-mickey-payment",
      name: "Hyperia audit: Iconic Mickey payment",
      description: "Zero-ink play and turn-end reward logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-iconic-mickey-payment", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditIconicMickeyPaymentFixture,
          ),
        ),
    },
    {
      id: "set14-audit-iconic-mickey",
      name: "Hyperia audit: Iconic Mickey",
      description:
        "Adventurous challenge restriction, mandatory quest and each-player end-turn drops.",
      load: () =>
        loadAndValidateFixture("set14-audit-iconic-mickey", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditIconicMickeyFixture),
        ),
    },
    {
      id: "set14-audit-khan-industries",
      name: "Hyperia audit: Khan Industries",
      description:
        "Protected characters, legal location challenges and movement out of protection.",
      load: () =>
        loadAndValidateFixture("set14-audit-khan-industries", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditKhanIndustriesFixture),
        ),
    },
    {
      id: "set14-audit-station-off-turn",
      name: "Hyperia audit: Central Station off-turn movement",
      description: "Synthetic opposing-turn movement must not reward or consume next own reward.",
      load: () =>
        loadAndValidateFixture("set14-audit-station-off-turn", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditStationOffTurnFixture),
        ),
    },
    {
      id: "set14-audit-central-station",
      name: "Hyperia audit: Central Station",
      description: "Movement reward, once-per-turn limit and next-turn reset.",
      load: () =>
        loadAndValidateFixture("set14-audit-central-station", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditCentralStationFixture),
        ),
    },
    {
      id: "set14-audit-ink-explosion",
      name: "Hyperia audit: Ink Explosion",
      description: "Four damage, controller drop gain, payment, Ward and Resist.",
      load: () =>
        loadAndValidateFixture("set14-audit-ink-explosion", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditInkExplosionFixture),
        ),
    },
    {
      id: "set14-audit-jousting-match",
      name: "Hyperia audit: Jousting Match",
      description: "Ink and drop payment, damage replacement, Ward and Resist targets.",
      load: () =>
        loadAndValidateFixture("set14-audit-jousting-match", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditJoustingMatchFixture),
        ),
    },
    {
      id: "set14-audit-tiana-hostess",
      name: "Hyperia audit: Tiana Party Hostess",
      description: "Draw, chosen discard, free location identity and Shift.",
      load: () =>
        loadAndValidateFixture("set14-audit-tiana-hostess", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditTianaHostessFixture),
        ),
    },
    {
      id: "set14-audit-shere-khan-ceo-player-two",
      name: "Hyperia audit: CEO player-two independent rewards",
      description: "Printed ability ownership and boundary checks.",
      load: () =>
        loadAndValidateFixture("set14-audit-shere-khan-ceo-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditShereKhanCeoPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-shere-khan-ceo-grants",
      name: "Hyperia audit: CEO self Ward and opposing grants",
      description: "Printed ability ownership and boundary checks.",
      load: () =>
        loadAndValidateFixture("set14-audit-shere-khan-ceo-grants", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditShereKhanCeoGrantsFixture),
        ),
    },
    {
      id: "set14-audit-shere-khan-ceo",
      name: "Hyperia audit: Shere Khan CEO",
      description: "Ready challenges, target legality and once-per-turn rewards.",
      load: () =>
        loadAndValidateFixture("set14-audit-shere-khan-ceo", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditShereKhanCeoFixture),
        ),
    },
    {
      id: "set14-audit-mr-big",
      name: "Hyperia audit: Mr Big Distribution Magnate",
      description: "End-turn challenge restriction, targets and expiry.",
      load: () =>
        loadAndValidateFixture("set14-audit-mr-big", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMrBigFixture),
        ),
    },
    {
      id: "set14-audit-arthur-jousting",
      name: "Hyperia audit: Arthur Jousting Knight",
      description: "Challenge rewards, Challenger, Shift and normal actions.",
      load: () =>
        loadAndValidateFixture("set14-audit-arthur-jousting", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditArthurJoustingFixture),
        ),
    },
    {
      id: "set14-audit-kit-sure-shot",
      name: "Hyperia audit: Kit Sure Shot",
      description: "Quest choices, Shift, target legality, and controller ownership.",
      load: () =>
        loadAndValidateFixture("set14-audit-kit-sure-shot", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditKitSureShotFixture),
        ),
    },
    {
      id: "set14-audit-baloo-freight",
      name: "Hyperia audit: Baloo Freight Pilot",
      description: "Resist prevention, repeated action damage, and challenge damage.",
      load: () =>
        loadAndValidateFixture("set14-audit-baloo-freight", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditBalooFreightFixture),
        ),
    },
    {
      id: "set14-audit-sir-ector",
      name: "Hyperia audit: Sir Ector",
      description: "Repeated challenge draws and mutual banishment reward.",
      load: () =>
        loadAndValidateFixture("set14-audit-sir-ector", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditSirEctorFixture),
        ),
    },
    {
      id: "set14-audit-koslov",
      name: "Hyperia audit: Koslov",
      description: "Vanilla stats, paid entry, quest, and challenge.",
      load: () =>
        loadAndValidateFixture("set14-audit-koslov", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditKoslovFixture),
        ),
    },
    {
      id: "set14-audit-baloo",
      name: "Hyperia audit: Baloo",
      description: "Current-turn drop permission for quest and challenge.",
      load: () =>
        loadAndValidateFixture("set14-audit-baloo", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditBalooFixture),
        ),
    },
    {
      id: "set14-audit-marie-prevented",
      name: "Hyperia audit: Marie prevented damage",
      description: "Fully prevented damage does not qualify Marie.",
      load: () =>
        loadAndValidateFixture("set14-audit-marie-prevented", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMariePreventedFixture),
        ),
    },
    {
      id: "set14-audit-marie-healing",
      name: "Hyperia audit: Marie healed damage",
      description: "Healed current-turn damage still qualifies each Marie.",
      load: () =>
        loadAndValidateFixture("set14-audit-marie-healing", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMarieHealingFixture),
        ),
    },
    {
      id: "set14-audit-marie",
      name: "Hyperia audit: Marie",
      description: "Quest rewards for current-turn opposing damage.",
      load: () =>
        loadAndValidateFixture("set14-audit-marie", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMarieFixture),
        ),
    },
    {
      id: "set14-audit-berlioz-keywords",
      name: "Hyperia audit: Berlioz Ward and Resist",
      description: "Opposing Ward exclusion and Resist damage prevention.",
      load: () =>
        loadAndValidateFixture("set14-audit-berlioz-keywords", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditBerliozKeywordsFixture),
        ),
    },
    {
      id: "set14-audit-berlioz",
      name: "Hyperia audit: Berlioz",
      description: "Entry damage targets and optional decline.",
      load: () =>
        loadAndValidateFixture("set14-audit-berlioz", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditBerliozFixture),
        ),
    },
    {
      id: "set14-audit-arthur-novice-no-ink",
      name: "Hyperia audit: Arthur no crafting ink",
      description: "Exact-cost entry cannot pay for crafting.",
      load: () =>
        loadAndValidateFixture("set14-audit-arthur-novice-no-ink", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditArthurNoviceNoInkFixture),
        ),
    },
    {
      id: "set14-audit-arthur-novice",
      name: "Hyperia audit: Arthur Novice Blacksmith",
      description: "Optional crafting payment and controller ownership.",
      load: () =>
        loadAndValidateFixture("set14-audit-arthur-novice", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditArthurNoviceFixture),
        ),
    },
    {
      id: "set14-audit-sir-pellinore-player-two",
      name: "Hyperia audit: Sir Pellinore player-two rewards and negatives",
      description: "Source ownership, character-only victory and opponent-turn negatives.",
      load: () =>
        loadAndValidateFixture("set14-audit-sir-pellinore-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditSirPellinorePlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-sir-pellinore",
      name: "Hyperia audit: Sir Pellinore",
      description: "Challenger and repeated challenge victory rewards.",
      load: () =>
        loadAndValidateFixture("set14-audit-sir-pellinore", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditSirPellinoreFixture),
        ),
    },
    {
      id: "set14-audit-chief-bogo",
      name: "Hyperia audit: Chief Bogo",
      description: "Free Hyperia City quest movement and challenge restriction.",
      load: () =>
        loadAndValidateFixture("set14-audit-chief-bogo", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditChiefBogoFixture),
        ),
    },
    {
      id: "set14-audit-toulouse",
      name: "Hyperia audit: Toulouse",
      description: "Opponent action and song restriction and expiry.",
      load: () =>
        loadAndValidateFixture("set14-audit-toulouse", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditToulouseFixture),
        ),
    },
    {
      id: "set14-audit-sir-kay",
      name: "Hyperia audit: Sir Kay",
      description: "Conditional Challenger and ink-drop spending.",
      load: () =>
        loadAndValidateFixture("set14-audit-sir-kay", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditSirKayFixture),
        ),
    },
    {
      id: "set14-audit-wildcat-empty",
      name: "Hyperia audit: Wildcat without items",
      description: "No legal item entry and normal actions.",
      load: () =>
        loadAndValidateFixture("set14-audit-wildcat-empty", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditWildcatEmptyFixture),
        ),
    },
    {
      id: "set14-audit-wildcat",
      name: "Hyperia audit: Wildcat",
      description: "Optional chosen item banishment and entry choices.",
      load: () =>
        loadAndValidateFixture("set14-audit-wildcat", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditWildcatFixture),
        ),
    },
    {
      id: "set14-audit-napoleon",
      name: "Hyperia audit: Napoleon",
      description: "Alert challenge legality and damage.",
      load: () =>
        loadAndValidateFixture("set14-audit-napoleon", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditNapoleonFixture),
        ),
    },
    {
      id: "set14-audit-woolter-player-two",
      name: "Hyperia audit: Woolter player-two multiple Bodyguards",
      description: "Reversed Challenger attack and multiple-Bodyguard selector boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-woolter-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditWoolterPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-woolter",
      name: "Hyperia audit: Woolter & Jesse",
      description: "Bodyguard entry choices and Challenger damage.",
      load: () =>
        loadAndValidateFixture("set14-audit-woolter", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditWoolterFixture),
        ),
    },
    {
      id: "set14-audit-raya",
      name: "Hyperia audit: Raya Determined Explorer",
      description: "Friendly location count changes, both controllers and quest lore.",
      load: () =>
        loadAndValidateFixture("set14-audit-raya", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditRayaFixture),
        ),
    },
    {
      id: "set14-audit-arthur-no-location",
      name: "Hyperia audit: Arthur without locations",
      description: "No-location entry and normal quest/ink.",
      load: () =>
        loadAndValidateFixture("set14-audit-arthur-no-location", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditArthurNoLocationFixture),
        ),
    },
    {
      id: "set14-audit-arthur-player-two-pair",
      name: "Hyperia audit: player-two Arthur pair",
      description: "Owner-only entry and independent copy limits.",
      load: () =>
        loadAndValidateFixture("set14-audit-arthur-player-two-pair", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditArthurPlayerTwoPairFixture,
          ),
        ),
    },
    {
      id: "set14-audit-arthur",
      name: "Hyperia audit: Arthur",
      description: "Free friendly movement, optional decline and once-per-turn ink drop.",
      load: () =>
        loadAndValidateFixture("set14-audit-arthur", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditArthurFixture),
        ),
    },
    {
      id: "set14-audit-flash-pair",
      name: "Hyperia audit: Flash pair global Rush",
      description: "Both-owner global suppression until last Flash leaves.",
      load: () =>
        loadAndValidateFixture("set14-audit-flash-pair", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditFlashPairFixture),
        ),
    },
    {
      id: "set14-audit-flash-damage",
      name: "Hyperia audit: Flash zero and lethal damage",
      description: "Resist zero and lethal effect outcomes.",
      load: () =>
        loadAndValidateFixture("set14-audit-flash-damage", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditFlashDamageFixture),
        ),
    },
    {
      id: "set14-audit-flash-play",
      name: "Hyperia audit: Flash play and quest",
      description: "Noninkable menu, payment, drying and quest.",
      load: () =>
        loadAndValidateFixture("set14-audit-flash-play", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditFlashPlayFixture),
        ),
    },
    {
      id: "set14-audit-flash-expiry",
      name: "Hyperia audit: Flash temporary Rush expiry",
      description: "Previously granted Rush expires while suppressed.",
      load: () =>
        loadAndValidateFixture("set14-audit-flash-expiry", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditFlashExpiryFixture),
        ),
    },
    {
      id: "set14-audit-flash-opposing-grant",
      name: "Hyperia audit: Flash blocks opposing Rush grant",
      description: "Blocked opposing grant does not persist after Flash leaves.",
      load: () =>
        loadAndValidateFixture("set14-audit-flash-opposing-grant", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditFlashOpposingGrantFixture),
        ),
    },
    {
      id: "set14-audit-flash",
      name: "Hyperia audit: Flash",
      description: "Rush prevention, source removal, Resist and public outcomes.",
      load: () =>
        loadAndValidateFixture("set14-audit-flash", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditFlashFixture),
        ),
    },
    {
      id: "set14-audit-lab-player-two",
      name: "Hyperia audit: player-two Lab",
      description: "Own payment, movement, return, lore and empty discard.",
      load: () =>
        loadAndValidateFixture("set14-audit-lab-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditLabPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-lab-pair",
      name: "Hyperia audit: separate Lab limits",
      description: "Exact duplicate Lab locations have independent returns.",
      load: () =>
        loadAndValidateFixture("set14-audit-lab-pair", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditLabPairFixture),
        ),
    },
    {
      id: "set14-audit-lab",
      name: "Hyperia audit: Honey Lemon's Lab",
      description: "Mandatory item recovery, Super eligibility and once-per-turn reset.",
      load: () =>
        loadAndValidateFixture("set14-audit-lab", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditLabFixture),
        ),
    },
    {
      id: "set14-audit-spyglass",
      name: "Hyperia audit: Spyglass Hat",
      description: "Self-entry trigger and private noninkable hand-card ink placement.",
      load: () =>
        loadAndValidateFixture("set14-audit-spyglass", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditSpyglassFixture),
        ),
    },
    {
      id: "set14-audit-prototype-player-two",
      name: "Hyperia audit: Prototype player-two boundaries",
      description: "Enigma Burst ownership, banishment and Resist boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-prototype-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditPrototypePlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-prototype-opposing-turn",
      name: "Hyperia audit: Prototype opposing-turn banishment",
      description: "Enigma Burst ownership, banishment and Resist boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-prototype-opposing-turn", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditPrototypeOpposingTurnFixture,
          ),
        ),
    },
    {
      id: "set14-audit-prototype-no-friendly",
      name: "Hyperia audit: Prototype no friendly character",
      description: "Enigma Burst ownership, banishment and Resist boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-prototype-no-friendly", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditPrototypeNoFriendlyFixture,
          ),
        ),
    },
    {
      id: "set14-audit-prototype",
      name: "Hyperia audit: Prototype Chem Ball",
      description: "Friendly Resist, challenge damage and next-turn expiration.",
      load: () =>
        loadAndValidateFixture("set14-audit-prototype", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditPrototypeFixture),
        ),
    },
    {
      id: "set14-audit-chem-ball-player-two",
      name: "Hyperia audit: Chem Ball player two",
      description: "Brilliant Burst ownership, banishment and missing-target boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-chem-ball-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditChemBallPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-chem-ball-opposing-turn",
      name: "Hyperia audit: Chem Ball opposing-turn banishment",
      description: "Brilliant Burst ownership, banishment and missing-target boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-chem-ball-opposing-turn", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditChemBallOpposingTurnFixture,
          ),
        ),
    },
    {
      id: "set14-audit-chem-ball-no-characters",
      name: "Hyperia audit: Chem Ball no characters",
      description: "Brilliant Burst ownership, banishment and missing-target boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-chem-ball-no-characters", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditChemBallNoCharactersFixture,
          ),
        ),
    },
    {
      id: "set14-audit-chem-ball",
      name: "Hyperia audit: Blinding Chem Ball",
      description: "Optional banish trigger, Ward targeting and turn duration.",
      load: () =>
        loadAndValidateFixture("set14-audit-chem-ball", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditChemBallFixture),
        ),
    },
    {
      id: "set14-audit-scram-player-two",
      name: "Hyperia audit: Scram player-two boundaries",
      description: "Ward, duplicate ownership and no-legal-target action completion.",
      load: () =>
        loadAndValidateFixture("set14-audit-scram-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditScramPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-scram",
      name: "Hyperia audit: Scram!",
      description: "Opposing low-cost targeting and exerted ink placement.",
      load: () =>
        loadAndValidateFixture("set14-audit-scram", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditScramFixture),
        ),
    },
    {
      id: "set14-audit-research-empty",
      name: "Hyperia audit: set14-audit-research-empty",
      description: "Research empty-deck payment boundary.",
      load: () =>
        loadAndValidateFixture("set14-audit-research-empty", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditResearchEmptyFixture),
        ),
    },
    {
      id: "set14-audit-research-empty-drop",
      name: "Hyperia audit: set14-audit-research-empty-drop",
      description: "Research empty-deck payment boundary.",
      load: () =>
        loadAndValidateFixture("set14-audit-research-empty-drop", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditResearchEmptyDropFixture),
        ),
    },
    {
      id: "set14-audit-research-one",
      name: "Hyperia audit: set14-audit-research-one",
      description: "Research one-card deck boundary.",
      load: () =>
        loadAndValidateFixture("set14-audit-research-one", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditResearchOneFixture),
        ),
    },
    {
      id: "set14-audit-research-one-drop",
      name: "Hyperia audit: set14-audit-research-one-drop",
      description: "Research one-card deck boundary.",
      load: () =>
        loadAndValidateFixture("set14-audit-research-one-drop", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditResearchOneDropFixture),
        ),
    },
    {
      id: "set14-audit-research-player-two",
      name: "Hyperia audit: player-two Research",
      description: "Research player-two payment and private choice.",
      load: () =>
        loadAndValidateFixture("set14-audit-research-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditResearchPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-research",
      name: "Hyperia audit: Intense Research",
      description: "Two-card and five-card look, mandatory take-one and private logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-research", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditResearchFixture),
        ),
    },
    {
      id: "set14-audit-obsolete-empty",
      name: "Hyperia audit: set14-audit-obsolete-empty",
      description: "Obsolete remaining browser boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-obsolete-empty", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditObsoleteEmptyFixture),
        ),
    },
    {
      id: "set14-audit-obsolete-player-two",
      name: "Hyperia audit: set14-audit-obsolete-player-two",
      description: "Obsolete remaining browser boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-obsolete-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditObsoletePlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-obsolete",
      name: "Hyperia audit: Everything Else Is Obsolete",
      description: "Three-card split, song payment and private logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-obsolete", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditObsoleteFixture),
        ),
    },
    {
      id: "set14-audit-obsolete-short",
      name: "Hyperia audit: Obsolete one-card deck",
      description: "Mandatory ink placement with no deck destination capacity.",
      load: () =>
        loadAndValidateFixture("set14-audit-obsolete-short", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditObsoleteShortFixture),
        ),
    },
    {
      id: "set14-audit-obsolete-pair",
      name: "Hyperia audit: Obsolete two-card deck",
      description: "Mandatory ink and deck-top placement with no bottom capacity.",
      load: () =>
        loadAndValidateFixture("set14-audit-obsolete-pair", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditObsoletePairFixture),
        ),
    },
    {
      id: "set14-audit-dark-age-player-two",
      name: "Hyperia audit: A Dark Age No More player two",
      description: "Top-deck ink ownership, privacy and ink-drop boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-dark-age-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditDarkAgePlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-dark-age-empty",
      name: "Hyperia audit: A Dark Age No More empty deck",
      description: "Top-deck ink ownership, privacy and ink-drop boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-dark-age-empty", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditDarkAgeEmptyFixture),
        ),
    },
    {
      id: "set14-audit-dark-age",
      name: "Hyperia audit: A Dark Age No More",
      description: "Top-deck ink, ink-drop gain and payment.",
      load: () =>
        loadAndValidateFixture("set14-audit-dark-age", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditDarkAgeFixture),
        ),
    },
    {
      id: "set14-audit-doug-player-two",
      name: "Hyperia audit: Doug player-two Ward boundaries",
      description: "Opposing chosen protection, own selection and nonchosen damage.",
      load: () =>
        loadAndValidateFixture("set14-audit-doug-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditDougPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-doug",
      name: "Hyperia audit: Doug Lying in Wait",
      description: "Ward targeting restrictions and legal challenges.",
      load: () =>
        loadAndValidateFixture("set14-audit-doug", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditDougFixture),
        ),
    },
    {
      id: "set14-audit-clarabelle-no-items",
      name: "Hyperia audit: Clarabelle without items",
      description: "Clarabelle remaining browser boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-clarabelle-no-items", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditClarabelleNoItemsFixture),
        ),
    },
    {
      id: "set14-audit-clarabelle-player-two",
      name: "Hyperia audit: Player-two Clarabelle",
      description: "Clarabelle remaining browser boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-clarabelle-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditClarabellePlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-clarabelle",
      name: "Hyperia audit: Clarabelle Out for a Stroll",
      description: "Item owner top-deck ink, exertion and private logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-clarabelle", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditClarabelleFixture),
        ),
    },
    {
      id: "set14-audit-bellwether",
      name: "Hyperia audit: Bellwether Highly Qualified",
      description: "Opposing cost-limited target choice and exerted ink entry.",
      load: () =>
        loadAndValidateFixture("set14-audit-bellwether", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditBellwetherFixture),
        ),
    },
    {
      id: "set14-audit-cinderella-pair",
      name: "Hyperia audit: Cinderella two-card split",
      description: "Mandatory deck and ink split with private logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-cinderella-pair", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditCinderellaPairFixture),
        ),
    },
    {
      id: "set14-audit-cinderella-short",
      name: "Hyperia audit: Cinderella short deck",
      description: "One-card deck choice and private logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-cinderella-short", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditCinderellaShortFixture),
        ),
    },
    {
      id: "set14-audit-ariel",
      name: "Hyperia audit: Ariel Collector of Oddities",
      description: "New-name item draw, duplicate suppression and distinct collection lore.",
      load: () =>
        loadAndValidateFixture("set14-audit-ariel", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditArielFixture),
        ),
    },
    {
      id: "set14-audit-honey-curious",
      name: "Hyperia audit: Honey Lemon Endlessly Curious",
      description: "Item discount, other card types, one-use payment and turn expiry.",
      load: () =>
        loadAndValidateFixture("set14-audit-honey-curious", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditHoneyCuriousFixture),
        ),
    },
    {
      id: "set14-audit-hiro",
      name: "Hyperia audit: Hiro Hamada Pioneering Inventor",
      description: "Friendly item lore bonus, opposing item exclusion and immediate expiry.",
      load: () =>
        loadAndValidateFixture("set14-audit-hiro", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditHiroFixture),
        ),
    },
    {
      id: "set14-audit-daisy",
      name: "Hyperia audit: Daisy Duck Savvy Investor",
      description: "Optional hand-to-ink choice, non-inkable card, exertion and privacy.",
      load: () =>
        loadAndValidateFixture("set14-audit-daisy", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditDaisyFixture),
        ),
    },
    {
      id: "set14-audit-bellwether-player-two",
      name: "Hyperia audit: Bellwether Player Two duplicate targets",
      description: "Ward, exact opposing duplicates, chooser ownership and no legal target.",
      load: () =>
        import("./set14-audit-regressions.js").then((m) => m.set14AuditBellwetherPlayerTwoFixture),
    },
    {
      id: "set14-audit-bellwether-no-target",
      name: "Hyperia audit: Bellwether no legal target",
      description: "Ward, exact opposing duplicates, chooser ownership and no legal target.",
      load: () =>
        import("./set14-audit-regressions.js").then((m) => m.set14AuditBellwetherNoTargetFixture),
    },
    {
      id: "set14-audit-baymax-shift-player-two",
      name: "Hyperia audit: Baymax drop Shift and Player Two",
      description: "Drop-only Shift payment, inherited states and optional Supercharge ownership.",
      load: () =>
        import("./set14-audit-regressions.js").then((m) => m.set14AuditBaymaxShiftPlayerTwoFixture),
    },
    {
      id: "set14-audit-baymax-shift-states",
      name: "Hyperia audit: Baymax drop Shift inherited states",
      description: "Drop-only Shift payment, inherited states and optional Supercharge ownership.",
      load: () =>
        import("./set14-audit-regressions.js").then((m) => m.set14AuditBaymaxShiftStatesFixture),
    },
    {
      id: "set14-audit-baymax-two-sources",
      name: "Hyperia audit: Baymax two replacement sources",
      description: "Drop-only Shift payment, inherited states and optional Supercharge ownership.",
      load: () =>
        import("./set14-audit-regressions.js").then((m) => m.set14AuditBaymaxTwoSourcesFixture),
    },
    {
      id: "set14-audit-cinderella-player-two",
      name: "Hyperia audit: Cinderella Player Two Shift and choices",
      description: "Shift payment and inherited states, private Player Two Bespoke Design choices.",
      load: () =>
        import("./set14-audit-regressions.js").then((m) => m.set14AuditCinderellaPlayerTwoFixture),
    },
    {
      id: "set14-audit-cinderella-shift-states",
      name: "Hyperia audit: Cinderella inherited Shift states",
      description: "Shift payment and inherited states, private Player Two Bespoke Design choices.",
      load: () =>
        import("./set14-audit-regressions.js").then(
          (m) => m.set14AuditCinderellaShiftStatesFixture,
        ),
    },
    {
      id: "set14-audit-cinderella-shift-payment",
      name: "Hyperia audit: Cinderella Shift payment boundary",
      description: "Shift payment and inherited states, private Player Two Bespoke Design choices.",
      load: () =>
        import("./set14-audit-regressions.js").then(
          (m) => m.set14AuditCinderellaShiftPaymentFixture,
        ),
    },
    {
      id: "set14-audit-ariel-player-two",
      name: "Hyperia audit: Ariel Player Two collections",
      description: "Collection ownership, independent triggers and resolution-time name checks.",
      load: () =>
        import("./set14-audit-regressions.js").then((m) => m.set14AuditArielPlayerTwoFixture),
    },
    {
      id: "set14-audit-ariel-empty",
      name: "Hyperia audit: Ariel empty deck",
      description: "Collection ownership, independent triggers and resolution-time name checks.",
      load: () => import("./set14-audit-regressions.js").then((m) => m.set14AuditArielEmptyFixture),
    },
    {
      id: "set14-audit-ariel-name-removal",
      name: "Hyperia audit: Ariel name becomes unique",
      description: "Collection ownership, independent triggers and resolution-time name checks.",
      load: () =>
        import("./set14-audit-regressions.js").then((m) => m.set14AuditArielNameRemovalFixture),
    },
    {
      id: "set14-audit-ariel-name-added",
      name: "Hyperia audit: Ariel name stops being unique",
      description: "Collection ownership, independent triggers and resolution-time name checks.",
      load: () =>
        import("./set14-audit-regressions.js").then((m) => m.set14AuditArielNameAddedFixture),
    },
    {
      id: "set14-audit-minnie-player-two",
      name: "Hyperia audit: Minnie choices",
      description: "All by Design optional branches, ownership and logs.",
      load: () =>
        import("./set14-audit-regressions.js").then((m) => m.set14AuditMinniePlayerTwoFixture),
    },
    {
      id: "set14-audit-minnie-ward-timing",
      name: "Hyperia audit: Minnie Ward and timing",
      description: "All by Design optional branches, ownership and logs.",
      load: () =>
        import("./set14-audit-regressions.js").then((m) => m.set14AuditMinnieWardTimingFixture),
    },
    {
      id: "set14-audit-minnie-empty",
      name: "Hyperia audit: Minnie empty inkwell",
      description: "All by Design optional branches, ownership and logs.",
      load: () =>
        import("./set14-audit-regressions.js").then((m) => m.set14AuditMinnieEmptyFixture),
    },
    {
      id: "set14-audit-judy-daycamp-player-two",
      name: "Hyperia audit: Judy Day Camp Player Two",
      description: "Current-strength Support, Ward, independent Lend a Paw copies and private ink.",
      load: () =>
        import("./set14-audit-regressions.js").then((m) => m.set14AuditJudyDayCampPlayerTwoFixture),
    },
    {
      id: "set14-audit-judy-daycamp-empty",
      name: "Hyperia audit: Judy Day Camp empty deck",
      description: "Existing character and item exclusion, then empty-deck completion.",
      load: () =>
        import("./set14-audit-regressions.js").then((m) => m.set14AuditJudyDayCampEmptyFixture),
    },
    {
      id: "set14-audit-duchess-player-two",
      name: "Hyperia audit: Duchess Player Two",
      description:
        "Highest-cost ties, loss/restoration, mandatory private duplicate-card look and logs.",
      load: () =>
        import("./set14-audit-regressions.js").then((m) => m.set14AuditDuchessPlayerTwoFixture),
    },
    {
      id: "set14-audit-duchess-empty",
      name: "Hyperia audit: Duchess empty deck",
      description: "Self-highest lore and empty mandatory-look completion.",
      load: () =>
        import("./set14-audit-regressions.js").then((m) => m.set14AuditDuchessEmptyFixture),
    },
    {
      id: "set14-audit-thomas-ties-empty",
      name: "Hyperia audit: Thomas ties and empty decks",
      description: "Different-type ties, exact owners, lone card and empty-deck completion.",
      load: () =>
        import("./set14-audit-regressions.js").then((m) => m.set14AuditThomasTiesEmptyFixture),
    },
    {
      id: "set14-audit-thomas-player-two-order",
      name: "Hyperia audit: Thomas Player Two bottom order",
      description:
        "Losing top below untouched cards, next-top reveal, reversed ownership and logs.",
      load: () =>
        import("./set14-audit-regressions.js").then((m) => m.set14AuditThomasPlayerTwoOrderFixture),
    },
    {
      id: "set14-audit-honey-curious-player-two",
      name: "Hyperia audit: Curious Honey Player Two",
      description: "Stacked grants, full consumption, non-item persistence and zero-cost items.",
      load: () =>
        import("./set14-audit-regressions.js").then(
          (m) => m.set14AuditHoneyCuriousPlayerTwoFixture,
        ),
    },
    {
      id: "set14-audit-honey-curious-expiry",
      name: "Hyperia audit: Curious Honey discount expiry",
      description: "Unused grant expiry, opponent exclusion and renewed exact payment.",
      load: () =>
        import("./set14-audit-regressions.js").then((m) => m.set14AuditHoneyCuriousExpiryFixture),
    },
    {
      id: "set14-audit-hiro-player-two",
      name: "Hyperia audit: Hiro Player Two",
      description:
        "Non-stacking item lore, independent copies, last-item loss, restoration and logs.",
      load: () =>
        import("./set14-audit-regressions.js").then((m) => m.set14AuditHiroPlayerTwoFixture),
    },
    {
      id: "set14-audit-daisy-player-two",
      name: "Hyperia audit: Daisy Player Two",
      description:
        "Independent decline/accept, own-hand choices, private non-inkable ink and logs.",
      load: () =>
        import("./set14-audit-regressions.js").then((m) => m.set14AuditDaisyPlayerTwoFixture),
    },
    {
      id: "set14-audit-daisy-empty-hand",
      name: "Hyperia audit: Daisy empty hand",
      description: "Empty-hand entry finishes without ink or stuck choices.",
      load: () =>
        import("./set14-audit-regressions.js").then((m) => m.set14AuditDaisyEmptyHandFixture),
    },
    {
      id: "set14-audit-priscilla",
      name: "Hyperia audit: Priscilla Efficient Clerk",
      description: "Exerted entry, private top-two choice, exerted ink and decline.",
      load: () =>
        loadAndValidateFixture("set14-audit-priscilla", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditPriscillaFixture),
        ),
    },
    {
      id: "set14-audit-priscilla-player-two",
      name: "Hyperia audit: Priscilla Player Two",
      description: "Private split, exerted non-inkable ink, chooser isolation and logs.",
      load: () =>
        import("./set14-audit-regressions.js").then((m) => m.set14AuditPriscillaPlayerTwoFixture),
    },
    {
      id: "set14-audit-priscilla-short-deck",
      name: "Hyperia audit: Priscilla short deck",
      description: "One card must enter hand; empty-deck acceptance clears the effect.",
      load: () =>
        import("./set14-audit-regressions.js").then((m) => m.set14AuditPriscillaShortDeckFixture),
    },
    {
      id: "set14-audit-lionheart-player-two",
      name: "Hyperia audit: Lionheart Player Two",
      description:
        "Alert attack-only, exact Civic Duty targets, mixed payment, zero healing and both logs.",
      load: () =>
        import("./set14-audit-regressions.js").then((m) => m.set14AuditLionheartPlayerTwoFixture),
    },
    {
      id: "set14-audit-lionheart-fresh",
      name: "Hyperia audit: Lionheart fresh and exerted activation",
      description: "Non-exert activation during Fresh Ink and exerted state; repeated healing.",
      load: () =>
        import("./set14-audit-regressions.js").then((m) => m.set14AuditLionheartFreshFixture),
    },
    {
      id: "set14-audit-lionheart",
      name: "Hyperia audit: Lionheart Cleaning Up the City",
      description: "Location healing, six-ink payment, repeated use and public logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-lionheart", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditLionheartFixture),
        ),
    },
    {
      id: "set14-audit-mim-nosy-empty",
      name: "Hyperia audit: Mim empty opposing hand",
      description: "Private look boundary",
      load: () =>
        loadAndValidateFixture("set14-audit-mim-nosy-empty", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMimNosyEmptyFixture),
        ),
    },
    {
      id: "set14-audit-mim-nosy-player-two",
      name: "Hyperia audit: Mim player-two drop payment",
      description: "Private look boundary",
      load: () =>
        loadAndValidateFixture("set14-audit-mim-nosy-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMimNosyPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-spyglass-names",
      name: "Hyperia audit: Spyglass duplicate names",
      description: "Same-name and character entry exclusions.",
      load: () =>
        loadAndValidateFixture("set14-audit-spyglass-names", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditSpyglassNamesFixture),
        ),
    },
    {
      id: "set14-audit-go-go",
      name: "Hyperia audit: Go Go Working Late",
      description: "Vanilla 2/6/1 behavior and both player payment boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-go-go", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditGoGoFixture),
        ),
    },
    {
      id: "set14-audit-geese",
      name: "Hyperia audit: Abigail and Amelia",
      description: "Vanilla payment, drying, quest, ink and combat.",
      load: () =>
        loadAndValidateFixture("set14-audit-geese", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditGeeseFixture),
        ),
    },
    {
      id: "set14-audit-lafayette",
      name: "Hyperia audit: Lafayette All Ears",
      description: "Printed Alert attack and defense boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-lafayette", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditLafayetteFixture),
        ),
    },
    {
      id: "set14-audit-mim-nosy",
      name: "Hyperia audit: Madam Mim Nosy Neighbor",
      description: "Private hand look, spectator masking, payment and later draw visibility.",
      load: () =>
        loadAndValidateFixture("set14-audit-mim-nosy", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMimNosyFixture),
        ),
    },
    {
      id: "set14-audit-honey-researcher-player-two",
      name: "Hyperia audit: Honey Lemon Player Two",
      description:
        "Mixed Shift payment, return filters, optional decline, no-item completion and both player logs.",
      load: () =>
        import("./set14-audit-regressions.js").then(
          (m) => m.set14AuditHoneyResearcherPlayerTwoFixture,
        ),
    },
    {
      id: "set14-audit-honey-researcher-shift-states",
      name: "Hyperia audit: Honey Lemon Shift states",
      description: "Exerted/drying Shift inheritance and normal paid entry.",
      load: () =>
        import("./set14-audit-regressions.js").then(
          (m) => m.set14AuditHoneyResearcherShiftStatesFixture,
        ),
    },
    {
      id: "set14-audit-honey-researcher",
      name: "Hyperia audit: Honey Lemon Ingenious Researcher",
      description: "Shift, inherited state, optional item return, ink-drop gain and payment.",
      load: () =>
        loadAndValidateFixture("set14-audit-honey-researcher", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditHoneyResearcherFixture),
        ),
    },
    {
      id: "set14-audit-baymax-physician",
      name: "Hyperia audit: Baymax Qualified Physician",
      description: "Quest timing, healing amount choices, self/opponent targets and Ward legality.",
      load: () =>
        loadAndValidateFixture("set14-audit-baymax-physician", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditBaymaxPhysicianFixture),
        ),
    },
    {
      id: "set14-audit-wasabi-future-player-two",
      name: "Hyperia audit: Wasabi Future Thinker Player Two copies",
      description: "Independent paid grants, stacking, late arrivals, zero damage and expiry.",
      load: () =>
        loadAndValidateFixture("set14-audit-wasabi-future-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditWasabiFuturePlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-baymax-physician-player-two",
      name: "Hyperia audit: Baymax Physician Player Two healing boundaries",
      description:
        "Opposing healing, one/zero damage floors, target filtering and chooser ownership.",
      load: () =>
        loadAndValidateFixture("set14-audit-baymax-physician-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditBaymaxPhysicianPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-wasabi-future",
      name: "Hyperia audit: Wasabi Future Thinker",
      description: "Ink-drop condition, Ward targeting, Resist damage, source removal and expiry.",
      load: () =>
        loadAndValidateFixture("set14-audit-wasabi-future", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditWasabiFutureFixture),
        ),
    },
    {
      id: "set14-audit-dressmaker-single-player-two",
      name: "Hyperia audit: Dressmaker Player Two single deck",
      description: "Private top-card arrangement and short-deck completion for Player Two.",
      load: () =>
        loadAndValidateFixture("set14-audit-dressmaker-single-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditDressmakerSinglePlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-dressmaker-empty-player-two",
      name: "Hyperia audit: Dressmaker Player Two empty deck",
      description: "Private top-card arrangement and short-deck completion for Player Two.",
      load: () =>
        loadAndValidateFixture("set14-audit-dressmaker-empty-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditDressmakerEmptyPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-cinderella-dressmaker",
      name: "Hyperia audit: Cinderella Homespun Dressmaker",
      description:
        "Top/bottom choices, private look, later draw, paid entry and vanilla Carl quest.",
      load: () =>
        loadAndValidateFixture("set14-audit-cinderella-dressmaker", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditCinderellaDressmakerFixture,
          ),
        ),
    },
    {
      id: "set14-audit-khan-stadium-player-two",
      name: "Hyperia audit: Khan Stadium Player Two copies",
      description: "Replacement, independent copies, fresh/exerted occupants and ownership.",
      load: () =>
        loadAndValidateFixture("set14-audit-khan-stadium-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditKhanStadiumPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-khan-stadium",
      name: "Hyperia audit: Khan Stadium",
      description: "Movement, continuous Strength, combat, source removal and both public logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-khan-stadium", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditKhanStadiumFixture),
        ),
    },
    {
      id: "set14-audit-marigold-copies",
      name: "Hyperia audit: Marigold Bridge copies",
      description: "Player Two independent bonus, damaged sources and winning Set-step lore.",
      load: () =>
        loadAndValidateFixture("set14-audit-marigold-copies", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMarigoldCopiesFixture),
        ),
    },
    {
      id: "set14-audit-marigold-removed",
      name: "Hyperia audit: Marigold Bridge removed",
      description: "Player Two independent bonus, damaged sources and winning Set-step lore.",
      load: () =>
        loadAndValidateFixture("set14-audit-marigold-removed", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMarigoldRemovedFixture),
        ),
    },
    {
      id: "set14-audit-marigold-bridge",
      name: "Hyperia audit: Land of the Dead Marigold Bridge",
      description: "Own discard threshold, continuous lore change, Set-step gain and public logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-marigold-bridge", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMarigoldBridgeFixture),
        ),
    },
    {
      id: "set14-audit-torn-player-two",
      name: "Hyperia audit: torn-player-two",
      description: "Torn Corner printed ability boundary.",
      load: () =>
        loadAndValidateFixture("set14-audit-torn-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditTornPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-torn-short-0-player-two",
      name: "Hyperia audit: torn-short-0-player-two",
      description: "Torn Corner printed ability boundary.",
      load: () =>
        loadAndValidateFixture("set14-audit-torn-short-0-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditTornShort0PlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-torn-short-1-player-two",
      name: "Hyperia audit: torn-short-1-player-two",
      description: "Torn Corner printed ability boundary.",
      load: () =>
        loadAndValidateFixture("set14-audit-torn-short-1-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditTornShort1PlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-torn-late-photo",
      name: "Hyperia audit: torn-late-photo",
      description: "Torn Corner printed ability boundary.",
      load: () =>
        loadAndValidateFixture("set14-audit-torn-late-photo", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditTornLatePhotoFixture),
        ),
    },
    {
      id: "set14-audit-torn-removed-photo",
      name: "Hyperia audit: torn-removed-photo",
      description: "Torn Corner printed ability boundary.",
      load: () =>
        loadAndValidateFixture("set14-audit-torn-removed-photo", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditTornRemovedPhotoFixture),
        ),
    },
    {
      id: "set14-audit-torn-absent-photo",
      name: "Hyperia audit: torn-absent-photo",
      description: "Torn Corner printed ability boundary.",
      load: () =>
        loadAndValidateFixture("set14-audit-torn-absent-photo", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditTornAbsentPhotoFixture),
        ),
    },
    {
      id: "set14-audit-torn-origins",
      name: "Hyperia audit: torn-origins",
      description: "Torn Corner printed ability boundary.",
      load: () =>
        loadAndValidateFixture("set14-audit-torn-origins", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditTornOriginsFixture),
        ),
    },
    {
      id: "set14-audit-photo-player-two",
      name: "Hyperia audit: set14-audit-photo-player-two",
      description: "Reversed-seat Photo ability boundary.",
      load: () =>
        loadAndValidateFixture("set14-audit-photo-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditPhotoPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-photo-short-0-player-two",
      name: "Hyperia audit: set14-audit-photo-short-0-player-two",
      description: "Reversed-seat Photo ability boundary.",
      load: () =>
        loadAndValidateFixture("set14-audit-photo-short-0-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditPhotoShort0PlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-photo-short-1-player-two",
      name: "Hyperia audit: set14-audit-photo-short-1-player-two",
      description: "Reversed-seat Photo ability boundary.",
      load: () =>
        loadAndValidateFixture("set14-audit-photo-short-1-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditPhotoShort1PlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-photo-short-2-player-two",
      name: "Hyperia audit: set14-audit-photo-short-2-player-two",
      description: "Reversed-seat Photo ability boundary.",
      load: () =>
        loadAndValidateFixture("set14-audit-photo-short-2-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditPhotoShort2PlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-photo",
      name: "Hyperia audit: Rivera Family Photo",
      description: "Both modes, nine/eleven discard threshold, immediate use, costs and refresh.",
      load: () =>
        loadAndValidateFixture("set14-audit-photo", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditPhotoFixture),
        ),
    },
    {
      id: "set14-audit-goodbye-replay-player-two",
      name: "Hyperia audit: Though I Have to Say Goodbye replay for player two",
      description: "Exact own mills, opposing target, fresh Ward, fixed counts, replay and expiry.",
      load: () =>
        loadAndValidateFixture("set14-audit-goodbye-replay-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditGoodbyeReplayPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-goodbye-no-target-player-two",
      name: "Hyperia audit: Though I Have to Say Goodbye with no character target",
      description: "No legal chosen character still mills exactly the own top three.",
      load: () =>
        loadAndValidateFixture("set14-audit-goodbye-no-target-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditGoodbyeNoTargetPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-goodbye-zero-songs-player-two",
      name: "Hyperia audit: Though I Have to Say Goodbye with two non-songs",
      description: "Mill only two, zero song bonus and empty-deck loss at own turn end.",
      load: () =>
        loadAndValidateFixture("set14-audit-goodbye-zero-songs-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditGoodbyeZeroSongsPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-goodbye-one-card-player-two",
      name: "Hyperia audit: Though I Have to Say Goodbye with one available song",
      description: "Mill only one, opposing boost and expiry at own turn-end loss.",
      load: () =>
        loadAndValidateFixture("set14-audit-goodbye-one-card-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditGoodbyeOneCardPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-goodbye-empty-player-two",
      name: "Hyperia audit: Though I Have to Say Goodbye with an empty deck",
      description: "No mill, existing own song still counts, no immediate loss.",
      load: () =>
        loadAndValidateFixture("set14-audit-goodbye-empty-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditGoodbyeEmptyPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-goodbye",
      name: "Hyperia audit: Though I Have to Say Goodbye",
      description: "Milling, existing song count, fixed bonuses, singing, Ward and expiry.",
      load: () =>
        loadAndValidateFixture("set14-audit-goodbye", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditGoodbyeFixture),
        ),
    },
    {
      id: "set14-audit-scare-player-two",
      name: "Hyperia audit: If She Doesn’t Scare You for player two",
      description:
        "Singer 4 self-banishment, own Ward, opposing Resist and no legal second target.",
      load: () =>
        loadAndValidateFixture("set14-audit-scare-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditScarePlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-scare-no-own-player-two",
      name: "Hyperia audit: If She Doesn’t Scare You without an own character",
      description:
        "No own character prevents the second banishment despite legal opposing characters.",
      load: () =>
        loadAndValidateFixture("set14-audit-scare-no-own-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditScareNoOwnPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-scare",
      name: "Hyperia audit: If She Doesn't Scare You",
      description: "Two sequential banishments, singing, Ward and no-own-character behavior.",
      load: () =>
        loadAndValidateFixture("set14-audit-scare", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditScareFixture),
        ),
    },
    {
      id: "set14-audit-boundaries-replay-player-two",
      name: "Hyperia audit: Pushing Boundaries challenge triggers and replay for player two",
      description: "Own targets, whole-challenge protection, outside damage, drop use and replay.",
      load: () =>
        loadAndValidateFixture("set14-audit-boundaries-replay-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditBoundariesReplayPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-boundaries-no-target-player-two",
      name: "Hyperia audit: Pushing Boundaries without a target for player two",
      description: "No legal target still grants an ink drop that can be spent.",
      load: () =>
        loadAndValidateFixture("set14-audit-boundaries-no-target-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditBoundariesNoTargetPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-boundaries-declaration",
      name: "Hyperia audit: Pushing Boundaries synthetic declaration damage",
      description: "Test-only challenge declaration damage, combat protection and outside damage.",
      load: () =>
        loadAndValidateFixture("set14-audit-boundaries-declaration", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditBoundariesDeclarationFixture,
          ),
        ),
    },
    {
      id: "set14-audit-boundaries",
      name: "Hyperia audit: Pushing Boundaries",
      description: "While-challenging damage protection, repeated combat, ink drop and expiry.",
      load: () =>
        loadAndValidateFixture("set14-audit-boundaries", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditBoundariesFixture),
        ),
    },
    {
      id: "set14-audit-intimidation-bounds-player-two",
      name: "Hyperia audit: Intimidation current Strength and Resist for player two",
      description:
        "Strength zero/one, increased value exclusion, Resist, hidden targets and no legal target",
      load: () =>
        loadAndValidateFixture("set14-audit-intimidation-bounds-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditIntimidationBoundsPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-intimidation",
      name: "Hyperia audit: Intimidation Tactics",
      description: "Current Strength limiter, own Ward, banishment and payment logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-intimidation", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditIntimidationFixture),
        ),
    },
    {
      id: "set14-audit-mulan-replay-player-two",
      name: "Hyperia audit: Mulan replay and repeated Rush for player two",
      description: "Reversed-seat grants, exact draw, target departure, repeated Rush and expiry",
      load: () =>
        loadAndValidateFixture("set14-audit-mulan-replay-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditMulanReplayPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-mulan",
      name: "Hyperia audit: Mulan Martial Arts Master",
      description: "Temporary challenge draw and Strength; quest Rush; zone and turn expiry.",
      load: () =>
        loadAndValidateFixture("set14-audit-mulan", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMulanFixture),
        ),
    },
    {
      id: "set14-audit-tremaine-song-player-two",
      name: "Hyperia audit: Tremaine song-player-two",
      description: "Independent songs, fresh and lethal copies, hidden-zone exclusions",
      load: () =>
        loadAndValidateFixture("set14-audit-tremaine-song-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditTremaineSongPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-tremaine-entry-bounds",
      name: "Hyperia audit: Tremaine entry-bounds",
      description: "Stacked counters, Ward, Resist, free discard entry and source removal",
      load: () =>
        loadAndValidateFixture("set14-audit-tremaine-entry-bounds", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditTremaineEntryBoundsFixture,
          ),
        ),
    },
    {
      id: "set14-audit-tremaine-resist-player-two",
      name: "Hyperia audit: Tremaine resist-player-two",
      description: "Prevented self damage consumes the song allowance",
      load: () =>
        loadAndValidateFixture("set14-audit-tremaine-resist-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditTremaineResistPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-tremaine-source-departure",
      name: "Hyperia audit: Tremaine source-departure",
      description: "Song removes its source before the retained trigger",
      load: () =>
        loadAndValidateFixture("set14-audit-tremaine-source-departure", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditTremaineSourceDepartureFixture,
          ),
        ),
    },
    {
      id: "set14-audit-tremaine-empty",
      name: "Hyperia audit: Tremaine empty",
      description: "Self damage followed by an empty draw and end-turn loss",
      load: () =>
        loadAndValidateFixture("set14-audit-tremaine-empty", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditTremaineEmptyFixture),
        ),
    },
    {
      id: "set14-audit-wasabi-bounds-player-two",
      name: "Hyperia audit: Wasabi Resist and source departure for player two",
      description: "Zero/partial damage, independent copies, opposing turn and last known Strength",
      load: () =>
        loadAndValidateFixture("set14-audit-wasabi-bounds-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditWasabiBoundsPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-wasabi",
      name: "Hyperia audit: Wasabi Called into Battle",
      description: "Live Strength, character challenge triggers, mandatory damage and ink drops",
      load: () =>
        loadAndValidateFixture("set14-audit-wasabi", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditWasabiFixture),
        ),
    },
    {
      id: "set14-audit-roxanne",
      name: "Hyperia audit: Roxanne Concert Lover",
      description: "Free paired movement, temporary lore, decline and public logs",
      load: () =>
        loadAndValidateFixture("set14-audit-roxanne", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditRoxanneFixture),
        ),
    },
    {
      id: "set14-audit-roxanne-states-player-two",
      name: "Hyperia audit: Roxanne transfers and movement events for player two",
      description:
        "Current-location rejection, target state preservation and two movement events per pair",
      load: () =>
        loadAndValidateFixture("set14-audit-roxanne-states-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditRoxanneStatesPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-roxanne-stack-departure-player-two",
      name: "Hyperia audit: Roxanne stacked lore survives source departure for player two",
      description: "Repeated transfers, source departure, stacked lore and expiry",
      load: () =>
        loadAndValidateFixture("set14-audit-roxanne-stack-departure-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditRoxanneStackDeparturePlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-meilin",
      name: "Hyperia audit: Meilin Ecstatic Fan",
      description: "Singer 5, independent once-per-turn drops, payments and replay",
      load: () =>
        loadAndValidateFixture("set14-audit-meilin", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMeilinFixture),
        ),
    },
    {
      id: "set14-audit-meilin-singer-bounds-player-two",
      name: "Hyperia audit: Meilin lower Singer costs and non-song exclusion for player two",
      description:
        "Singer costs one through four, ordinary-action exclusion and outside-play sources",
      load: () =>
        loadAndValidateFixture("set14-audit-meilin-singer-bounds-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditMeilinSingerBoundsPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-meilin-together-player-two",
      name: "Hyperia audit: Meilin exact-eight Singer contribution for player two",
      description: "Singer contribution, insufficient-group retry and shared once-per-turn reward",
      load: () =>
        loadAndValidateFixture("set14-audit-meilin-together-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditMeilinTogetherPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-tramp",
      name: "Hyperia audit: Tramp Quick on His Feet",
      description: "Strength-limited exertion, temporary Rush, drying and combat logs",
      load: () =>
        loadAndValidateFixture("set14-audit-tramp", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditTrampFixture),
        ),
    },
    {
      id: "set14-audit-tramp-strength-player-two",
      name: "Hyperia audit: Tramp Ward and current strength for player two",
      description: "Own Ward, opposing Ward exclusion and modified strength limits",
      load: () =>
        loadAndValidateFixture("set14-audit-tramp-strength-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditTrampStrengthPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-tramp-self",
      name: "Hyperia audit: Tramp self-target synthetic boundary",
      description: "Test-only static reducer makes the fresh source eligible for exertion",
      load: () =>
        loadAndValidateFixture("set14-audit-tramp-self", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditTrampSelfFixture),
        ),
    },
    {
      id: "set14-audit-hector-pieces-player-two",
      name: "Hyperia audit: Hector Gone to Pieces Player Two",
      description: "Base/promo exact copies, lower songs and first/last-song recovery ownership.",
      load: () =>
        loadAndValidateFixture("set14-audit-hector-pieces-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditHectorPiecesPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-hector-pieces",
      name: "Hyperia audit: Hector Gone to Pieces",
      description: "Singer 6 and live own-discard lore/Evasive for both printings",
      load: () =>
        loadAndValidateFixture("set14-audit-hector-pieces", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditHectorPiecesFixture),
        ),
    },
    {
      id: "set14-audit-ernesto-ruthless",
      name: "Hyperia audit: Ernesto Ruthless Musician",
      description: "Singer 8 and optional Singer banishment",
      load: () =>
        loadAndValidateFixture("set14-audit-ernesto-ruthless", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditErnestoRuthlessFixture),
        ),
    },
    {
      id: "set14-audit-pepita-wisdom",
      name: "Hyperia audit: Pepita Imeldas Right Hand",
      description: "Shift 3 and live ten-card discard threshold",
      load: () =>
        loadAndValidateFixture("set14-audit-pepita-wisdom", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditPepitaWisdomFixture),
        ),
    },
    {
      id: "set14-audit-ernesto-idol",
      name: "Hyperia audit: Ernesto Idol of Millions",
      description: "Singer 5 and live opposing discard lore bonus",
      load: () =>
        loadAndValidateFixture("set14-audit-ernesto-idol", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditErnestoIdolFixture),
        ),
    },
    {
      id: "set14-audit-hector-street-empty",
      name: "Hyperia audit: Street Musician empty deck",
      description: "Accept the optional mill with an empty deck.",
      load: () =>
        loadAndValidateFixture("set14-audit-hector-street-empty", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditHectorStreetEmptyFixture),
        ),
    },
    {
      id: "set14-audit-ernesto-copies",
      name: "Hyperia audit: Ernesto copies and multiple songs",
      description: "Quest with two copies with two opposing discarded songs.",
      load: () =>
        loadAndValidateFixture("set14-audit-ernesto-copies", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditErnestoCopiesFixture),
        ),
    },
    {
      id: "set14-audit-pepita-exerted-shift",
      name: "Hyperia audit: Pepita exerted Shift",
      description: "Shift onto an exerted damaged base and inspect retained state.",
      load: () =>
        loadAndValidateFixture("set14-audit-pepita-exerted-shift", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditPepitaExertedShiftFixture),
        ),
    },
    {
      id: "set14-audit-hector-pieces-copies",
      name: "Hyperia audit: Gone to Pieces copy ownership",
      description: "Verify both printings use only own discarded songs.",
      load: () =>
        loadAndValidateFixture("set14-audit-hector-pieces-copies", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditHectorPiecesCopiesFixture),
        ),
    },
    {
      id: "set14-audit-tramp-no-target",
      name: "Hyperia audit: Tramp no exert target",
      description: "Choose exert when no weak character is available.",
      load: () =>
        loadAndValidateFixture("set14-audit-tramp-no-target", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditTrampNoTargetFixture),
        ),
    },
    {
      id: "set14-audit-meilin-non-song",
      name: "Hyperia audit: Meilin non-song allowance",
      description: "Play a character, then a song; only the in-play Meilin triggers.",
      load: () =>
        loadAndValidateFixture("set14-audit-meilin-non-song", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMeilinNonSongFixture),
        ),
    },
    {
      id: "set14-audit-roxanne-no-pair",
      name: "Hyperia audit: Roxanne no legal pair",
      description: "Accept optional movement with no legal character/location pair.",
      load: () =>
        loadAndValidateFixture("set14-audit-roxanne-no-pair", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditRoxanneNoPairFixture),
        ),
    },
    {
      id: "set14-audit-wasabi-quest",
      name: "Hyperia audit: Wasabi quest exclusion",
      description: "Quest with a held drop without triggering Twin Blades.",
      load: () =>
        loadAndValidateFixture("set14-audit-wasabi-quest", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditWasabiQuestFixture),
        ),
    },
    {
      id: "set14-audit-tremaine-miguel-inactive",
      name: "Hyperia audit: Tremaine inactive Singer condition",
      description: "Opposing song discard does not enable Miguel Singer",
      load: () =>
        loadAndValidateFixture("set14-audit-tremaine-miguel-inactive", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditTremaineMiguelInactiveFixture,
          ),
        ),
    },
    {
      id: "set14-audit-tremaine-miguel",
      name: "Hyperia audit: Tremaine conditional Singer entry",
      description: "Miguel own-discard Singer receives entry damage",
      load: () =>
        loadAndValidateFixture("set14-audit-tremaine-miguel", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditTremaineMiguelFixture),
        ),
    },
    {
      id: "set14-audit-mulan-resist",
      name: "Hyperia audit: Mulan draw despite prevented damage",
      description: "Character challenge draws even when Resist prevents all damage",
      load: () =>
        loadAndValidateFixture("set14-audit-mulan-resist", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMulanResistFixture),
        ),
    },
    {
      id: "set14-audit-mulan-empty-deck",
      name: "Hyperia audit: Mulan empty-deck challenge draw",
      description: "Combat completes before empty-deck loss at turn end",
      load: () =>
        loadAndValidateFixture("set14-audit-mulan-empty-deck", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMulanEmptyDeckFixture),
        ),
    },
    {
      id: "set14-audit-mulan-source-removal",
      name: "Hyperia audit: Mulan grant after source removal",
      description: "Temporary grant persists after Dragon Fire banishes its source",
      load: () =>
        loadAndValidateFixture("set14-audit-mulan-source-removal", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMulanSourceRemovalFixture),
        ),
    },
    {
      id: "set14-audit-mulan-stacked",
      name: "Hyperia audit: stacked Mulan grants",
      description: "Independent Strength and challenge-draw grants from two copies",
      load: () =>
        loadAndValidateFixture("set14-audit-mulan-stacked", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMulanStackedFixture),
        ),
    },
    {
      id: "set14-audit-tremaine-shift",
      name: "Hyperia audit: Tremaine Singer Shift",
      description: "Inherited damage plus source-attributed entry counter",
      load: () =>
        loadAndValidateFixture("set14-audit-tremaine-shift", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditTremaineShiftFixture),
        ),
    },
    {
      id: "set14-audit-tremaine-effect-entry",
      name: "Hyperia audit: Tremaine effect-driven lethal entry",
      description: "Just in Time free play retains Hector entry trigger after banishment",
      load: () =>
        loadAndValidateFixture("set14-audit-tremaine-effect-entry", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditTremaineEffectEntryFixture,
          ),
        ),
    },
    {
      id: "set14-audit-tremaine-lethal",
      name: "Hyperia audit: Tremaine lethal Singer entry",
      description: "Hector entry damage banishment and retained trigger",
      load: () =>
        loadAndValidateFixture("set14-audit-tremaine-lethal", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditTremaineLethalFixture),
        ),
    },
    {
      id: "set14-audit-tremaine-resist",
      name: "Hyperia audit: Tremaine prevented self-damage",
      description: "Mouse Armor prevents self-damage and conditional draw",
      load: () =>
        loadAndValidateFixture("set14-audit-tremaine-resist", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditTremaineResistFixture),
        ),
    },
    {
      id: "set14-audit-tremaine-song",
      name: "Hyperia audit: Tremaine entry and song choices",
      description: "Normal entry and optional song damage and draw",
      load: () =>
        loadAndValidateFixture("set14-audit-tremaine-song", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditTremaineSongFixture),
        ),
    },
    {
      id: "set14-audit-hector-street",
      name: "Hyperia audit: Hector Street Musician",
      description: "Optional top-card discard and Singer 2",
      load: () =>
        loadAndValidateFixture("set14-audit-hector-street", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditHectorStreetFixture),
        ),
    },
    {
      id: "set14-audit-peg",
      name: "Hyperia audit: Peg Late-Night Vocalist",
      description: "Singer 4 payment and readiness limits",
      load: () =>
        loadAndValidateFixture("set14-audit-peg", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditPegFixture),
        ),
    },
    {
      id: "set14-audit-jasper",
      name: "Hyperia audit: Jasper Dodgy Boater",
      description: "Evasive challenge legality, drying, quest, damage and logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-jasper", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditJasperFixture),
        ),
    },
    {
      id: "set14-audit-yama-exerted",
      name: "Hyperia audit: Yama exerted activation",
      description: "Activate Yama while drying and exerted, then challenge with Jock.",
      load: () =>
        loadAndValidateFixture("set14-audit-yama-exerted", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditYamaExertedFixture),
        ),
    },
    {
      id: "set14-audit-abigail-payment",
      name: "Hyperia audit: Abigail payment",
      description: "Check insufficient payment, ink one Abigail, then play the other.",
      load: () =>
        loadAndValidateFixture("set14-audit-abigail-payment", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditAbigailPaymentFixture),
        ),
    },
    {
      id: "set14-audit-stacey-payment",
      name: "Hyperia audit: Stacey payment",
      description: "Ink one Stacey, play the other for three, then quest next turn.",
      load: () =>
        loadAndValidateFixture("set14-audit-stacey-payment", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditStaceyPaymentFixture),
        ),
    },
    {
      id: "set14-audit-pepita-payment",
      name: "Hyperia audit: Pepita payment",
      description: "Ink one Pepita, then play the other for one.",
      load: () =>
        loadAndValidateFixture("set14-audit-pepita-payment", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditPepitaPaymentFixture),
        ),
    },
    {
      id: "set14-audit-donald-exerted",
      name: "Hyperia audit: Donald exerted target",
      description: "Grant Rush to exerted Jock and check he stays exerted.",
      load: () =>
        loadAndValidateFixture("set14-audit-donald-exerted", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditDonaldExertedFixture),
        ),
    },
    {
      id: "set14-audit-tourist-copies",
      name: "Hyperia audit: Tourist copies",
      description: "Two Tourist copies with exerted drying Singer; opposing copy stays zero.",
      load: () =>
        loadAndValidateFixture("set14-audit-tourist-copies", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditTouristCopiesFixture),
        ),
    },
    {
      id: "set14-audit-tadashi-survives",
      name: "Hyperia audit: Tadashi survives",
      description: "Check surviving combat gives no Tadashi reward.",
      load: () =>
        loadAndValidateFixture("set14-audit-tadashi-survives", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditTadashiSurvivesFixture),
        ),
    },
    {
      id: "set14-audit-cruella-fatal",
      name: "Hyperia audit: Cruella fatal Rush",
      description: "Play Cruella and Rush into fatal combat against Hook.",
      load: () =>
        loadAndValidateFixture("set14-audit-cruella-fatal", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditCruellaFatalFixture),
        ),
    },
    {
      id: "set14-audit-jasper-plain",
      name: "Hyperia audit: Jasper plain defender",
      description: "Challenge a plain defender with Jasper.",
      load: () =>
        loadAndValidateFixture("set14-audit-jasper-plain", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditJasperPlainFixture),
        ),
    },
    {
      id: "set14-audit-peg-limit",
      name: "Hyperia audit: Peg Singer limit",
      description: "Check Peg cannot sing a six-cost song even with ink available.",
      load: () =>
        loadAndValidateFixture("set14-audit-peg-limit", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditPegLimitFixture),
        ),
    },
    {
      id: "set14-audit-yama",
      name: "Hyperia audit: Yama",
      description: "Repeated floating triggers, character-only challenges and source removal.",
      load: () =>
        loadAndValidateFixture("set14-audit-yama", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditYamaFixture),
        ),
    },
    {
      id: "set14-audit-hector-empty-deck",
      name: "Hyperia audit: Hector empty deck",
      description: "Quest Hector with an empty deck, then pass.",
      load: () =>
        loadAndValidateFixture("set14-audit-hector-empty-deck", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditHectorEmptyDeckFixture),
        ),
    },
    {
      id: "set14-audit-hector-worldwide",
      name: "Hyperia audit: Hector Worldwide Sensation",
      description: "Shift, top-three optional song, required discard and first singing each turn.",
      load: () =>
        loadAndValidateFixture("set14-audit-hector-worldwide", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditHectorWorldwideFixture),
        ),
    },
    {
      id: "set14-audit-yama-copies-player-two",
      name: "Hyperia audit: Yama copies and saved drops",
      description:
        "Player Two payment rejection, independent floating rewards, saved drops and expiry.",
      load: () =>
        loadAndValidateFixture("set14-audit-yama-copies-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditYamaCopiesPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-hector-together-player-two",
      name: "Hyperia audit: Hector two singers",
      description: "Independent first-song limits, later-turn reset and private top-three routing.",
      load: () =>
        loadAndValidateFixture("set14-audit-hector-together-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditHectorTogetherPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-hector-drying-short-player-two",
      name: "Hyperia audit: Hector drying and short deck",
      description: "Selected-drop Shift, inherited drying, short and empty decks.",
      load: () =>
        loadAndValidateFixture("set14-audit-hector-drying-short-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditHectorDryingShortPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-goofy-drying",
      name: "Hyperia audit: Goofy drying Shift",
      description: "Play and Shift Goofy; check inherited drying blocks quest and singing.",
      load: () =>
        loadAndValidateFixture("set14-audit-goofy-drying", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditGoofyDryingFixture),
        ),
    },
    {
      id: "set14-audit-goofy-repeat-player-two",
      name: "Hyperia audit: set14-audit-goofy-repeat-player-two",
      description: "Goofy printed ability boundary checks.",
      load: () =>
        loadAndValidateFixture("set14-audit-goofy-repeat-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditGoofyRepeatPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-goofy-shift-singer-player-two",
      name: "Hyperia audit: set14-audit-goofy-shift-singer-player-two",
      description: "Goofy printed ability boundary checks.",
      load: () =>
        loadAndValidateFixture("set14-audit-goofy-shift-singer-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditGoofyShiftSingerPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-goofy",
      name: "Hyperia audit: Goofy Dancing Superstar",
      description: "Shift payment, quest bonuses, expiry and Singer 6.",
      load: () =>
        loadAndValidateFixture("set14-audit-goofy", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditGoofyFixture),
        ),
    },
    {
      id: "set14-audit-goofy-band-player-two",
      name: "Hyperia audit: Goofy Player-two multiple exerted Singers",
      description: "VIP Access ability boundaries and both player logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-goofy-band-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditGoofyBandPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-goofy-band-drying-singer",
      name: "Hyperia audit: Goofy Drying Singer qualifies",
      description: "VIP Access ability boundaries and both player logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-goofy-band-drying-singer", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditGoofyBandDryingSingerFixture,
          ),
        ),
    },
    {
      id: "set14-audit-goofy-band-empty",
      name: "Hyperia audit: Goofy Empty deck draw completes",
      description: "VIP Access ability boundaries and both player logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-goofy-band-empty", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditGoofyBandEmptyFixture),
        ),
    },
    {
      id: "set14-audit-goofy-band",
      name: "Hyperia audit: Goofy Knows the Band",
      description: "Conditional Singer activation and exactly one entry draw.",
      load: () =>
        loadAndValidateFixture("set14-audit-goofy-band", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditGoofyBandFixture),
        ),
    },
    {
      id: "set14-audit-mickey-best-player-two",
      name: "Hyperia audit: Mickey Best in Town Player Two",
      description:
        "Independent HOT DOG rewards, ready/fresh exclusion, mandatory quests and controller turn end.",
      load: () =>
        loadAndValidateFixture("set14-audit-mickey-best-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditMickeyBestPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-mickey-base",
      name: "Hyperia audit: Mickey Best in Town",
      description: "Adventurous restrictions and each-player drop payment.",
      load: () =>
        loadAndValidateFixture("set14-audit-mickey-base", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMickeyBaseFixture),
        ),
    },
    {
      id: "set14-audit-judy-vigilant-player-two",
      name: "Hyperia audit: Judy Player-two Shift, decline and friendly current strength",
      description: "GOT YOU NOW ability boundaries and both player logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-judy-vigilant-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditJudyVigilantPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-judy-vigilant-negatives",
      name: "Hyperia audit: Judy Prior-turn and action-only exclusions",
      description: "GOT YOU NOW ability boundaries and both player logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-judy-vigilant-negatives", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditJudyVigilantNegativesFixture,
          ),
        ),
    },
    {
      id: "set14-audit-judy-vigilant-no-target",
      name: "Hyperia audit: Judy No eligible target completes",
      description: "GOT YOU NOW ability boundaries and both player logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-judy-vigilant-no-target", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditJudyVigilantNoTargetFixture,
          ),
        ),
    },
    {
      id: "set14-audit-judy-vigilant",
      name: "Hyperia audit: Judy Always Vigilant",
      description:
        "Shift payment, same-turn character condition, and strength-filtered banishment.",
      load: () =>
        loadAndValidateFixture("set14-audit-judy-vigilant", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditJudyVigilantFixture),
        ),
    },
    {
      id: "set14-audit-nick-backup-player-two",
      name: "Hyperia audit: Nick player-two current strength and decline",
      description:
        "Other-copy Detective, current strength, opposing target, source exclusion and decline.",
      load: () =>
        loadAndValidateFixture("set14-audit-nick-backup-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditNickBackupPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-nick-backup",
      name: "Hyperia audit: Nick Providing Backup",
      description: "Live Detective condition, Support strength, removal and expiry.",
      load: () =>
        loadAndValidateFixture("set14-audit-nick-backup", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditNickBackupFixture),
        ),
    },
    {
      id: "set14-audit-miguel-accomplished-player-two",
      name: "Hyperia audit: Miguel Player-two exerted and drying Shift",
      description: "Shift and mandatory discard-return boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-miguel-accomplished-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditMiguelAccomplishedPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-miguel-accomplished-empty",
      name: "Hyperia audit: Miguel Empty discard finishes",
      description: "Shift and mandatory discard-return boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-miguel-accomplished-empty", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditMiguelAccomplishedEmptyFixture,
          ),
        ),
    },
    {
      id: "set14-audit-miguel-accomplished-non-character",
      name: "Hyperia audit: Miguel Non-character discard finishes",
      description: "Shift and mandatory discard-return boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-miguel-accomplished-non-character", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditMiguelAccomplishedNonCharacterFixture,
          ),
        ),
    },
    {
      id: "set14-audit-miguel-accomplished-insufficient",
      name: "Hyperia audit: Miguel Shift ink rejection",
      description: "Shift and mandatory discard-return boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-miguel-accomplished-insufficient", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditMiguelAccomplishedInsufficientFixture,
          ),
        ),
    },
    {
      id: "set14-audit-miguel-accomplished-wrong-name",
      name: "Hyperia audit: Miguel Shift name rejection",
      description: "Shift and mandatory discard-return boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-miguel-accomplished-wrong-name", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditMiguelAccomplishedWrongNameFixture,
          ),
        ),
    },
    {
      id: "set14-audit-miguel-accomplished",
      name: "Hyperia audit: Miguel Accomplished Musician",
      description: "Normal and Shift mandatory own-character discard return.",
      load: () =>
        loadAndValidateFixture("set14-audit-miguel-accomplished", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMiguelAccomplishedFixture),
        ),
    },
    {
      id: "set14-audit-never-apart-short",
      name: "Hyperia audit: Never Too Far Apart short deck",
      description: "Resolve top-nine effect with a short deck.",
      load: () =>
        loadAndValidateFixture("set14-audit-never-apart-short", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditNeverApartShortFixture),
        ),
    },
    {
      id: "set14-audit-lexington-ready",
      name: "Hyperia audit: Lexington ready limit",
      description: "Current hand threshold and Ready before Draw.",
      load: () =>
        loadAndValidateFixture("set14-audit-lexington-ready", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditLexingtonReadyFixture),
        ),
    },
    {
      id: "set14-audit-merlin-shift",
      name: "Hyperia audit: Merlin Shift drops",
      description: "Shift inheritance and immediate two-drop payment.",
      load: () =>
        loadAndValidateFixture("set14-audit-merlin-shift", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMerlinShiftFixture),
        ),
    },
    {
      id: "set14-audit-merlin-drop",
      name: "Hyperia audit: Merlin ink drop",
      description: "Friendly Arthur condition and spending the granted drop.",
      load: () =>
        loadAndValidateFixture("set14-audit-merlin-drop", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMerlinDropFixture),
        ),
    },
    {
      id: "set14-audit-merlin-player-two",
      name: "Hyperia audit: Merlin player-two Arthur condition",
      description: "Reversed-seat Arthur ownership, one drop and drop-funded payment.",
      load: () =>
        loadAndValidateFixture("set14-audit-merlin-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMerlinPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-pepita-challenge",
      name: "Hyperia audit: Pepita Challenger",
      description: "Attacking bonus, quest lore and base-strength defense.",
      load: () =>
        loadAndValidateFixture("set14-audit-pepita-challenge", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditPepitaChallengeFixture),
        ),
    },
    {
      id: "set14-audit-pepita-player-two",
      name: "Hyperia audit: Pepita player-two Challenger",
      description: "Reversed-seat Challenger damage, strength reset and public logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-pepita-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditPepitaPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-archimedes-evasive",
      name: "Hyperia audit: Archimedes Evasive",
      description: "Evasive target legality and retaliation damage.",
      load: () =>
        loadAndValidateFixture("set14-audit-archimedes-evasive", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditArchimedesEvasiveFixture),
        ),
    },
    {
      id: "set14-audit-archimedes-player-two",
      name: "Hyperia audit: Archimedes player-two Evasive",
      description: "Reversed-seat Evasive protection, legal attack and public damage logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-archimedes-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditArchimedesPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-victoria-player-two",
      name: "Hyperia audit: Victoria player-two timing",
      description: "Target-owner next-start restriction and later expiry.",
      load: () =>
        loadAndValidateFixture("set14-audit-victoria-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditVictoriaPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-dante-challenger",
      name: "Hyperia audit: Dante Challenger",
      description: "Temporary Challenger stacking, combat and expiry.",
      load: () =>
        loadAndValidateFixture("set14-audit-dante-challenger", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditDanteChallengerFixture),
        ),
    },
    {
      id: "set14-audit-dante-player-two",
      name: "Hyperia audit: Dante player-two Challenger targets",
      description: "Self, opposing and friendly grants; stacking, exact damage and expiry.",
      load: () =>
        loadAndValidateFixture("set14-audit-dante-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditDantePlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-coco-short-deck-player-two",
      name: "Hyperia audit: Coco player-two one-card mill",
      description: "One actual milled card grants one temporary lore bonus.",
      load: () =>
        loadAndValidateFixture("set14-audit-coco-short-deck-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditCocoShortDeckPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-coco-ownership",
      name: "Hyperia audit: Coco ownership and negative triggers",
      description: "Opposing-turn mill, own empty deck and hand-discard boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-coco-ownership", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditCocoOwnershipFixture),
        ),
    },
    {
      id: "set14-audit-coco-mill-batches",
      name: "Hyperia audit: Coco mill batches",
      description: "Separate mill batches, boosted quest lore and expiry.",
      load: () =>
        loadAndValidateFixture("set14-audit-coco-mill-batches", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditCocoMillBatchesFixture),
        ),
    },
    {
      id: "set14-audit-tinker-vanilla",
      name: "Hyperia audit: Tinker Bell vanilla",
      description: "Zero-strength combat, quest, paid entry and inking.",
      load: () =>
        loadAndValidateFixture("set14-audit-tinker-vanilla", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditTinkerVanillaFixture),
        ),
    },
    {
      id: "set14-audit-mim-player-two",
      name: "Hyperia audit: Mim player two",
      description: "Player-two drop payments and Evasive restoration.",
      load: () =>
        loadAndValidateFixture("set14-audit-mim-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMimPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-brooklyn-ink",
      name: "Hyperia audit: Brooklyn ink ability",
      description: "Repeatable ink-only lore while exerted and fresh.",
      load: () =>
        loadAndValidateFixture("set14-audit-brooklyn-ink", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditBrooklynInkFixture),
        ),
    },
    {
      id: "set14-audit-fox-rush",
      name: "Hyperia audit: Fox Rush",
      description: "Fresh Ink permits Rush challenges only.",
      load: () =>
        loadAndValidateFixture("set14-audit-fox-rush", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditFoxRushFixture),
        ),
    },
    {
      id: "set14-audit-dante-trash",
      name: "Hyperia audit: Dante discard threshold",
      description: "Live nine-to-ten discard lore threshold.",
      load: () =>
        loadAndValidateFixture("set14-audit-dante-trash", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditDanteTrashFixture),
        ),
    },
    {
      id: "set14-audit-shadow-exert",
      name: "Hyperia audit: Shadow exert",
      description: "Optional opposing exert and decline.",
      load: () =>
        loadAndValidateFixture("set14-audit-shadow-exert", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditShadowExertFixture),
        ),
    },
    {
      id: "set14-audit-mim-drops",
      name: "Hyperia audit: Mim ink drops",
      description: "Partial and last-drop payments update Evasive.",
      load: () =>
        loadAndValidateFixture("set14-audit-mim-drops", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMimDropsFixture),
        ),
    },
    {
      id: "set14-audit-amethyst-vanilla",
      name: "Hyperia audit: Scuttle and Xanatos",
      description: "Paid vanilla entry, Fresh Ink, questing and combat.",
      load: () =>
        loadAndValidateFixture("set14-audit-amethyst-vanilla", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditAmethystVanillaFixture),
        ),
    },
    {
      id: "set14-audit-owen-return",
      name: "Hyperia audit: Owen returns",
      description: "Optional return, occupied location and printed cost filter.",
      load: () =>
        loadAndValidateFixture("set14-audit-owen-return", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditOwenReturnFixture),
        ),
    },
    {
      id: "set14-audit-guitar-entry",
      name: "Hyperia audit: Ancestral Guitar entry",
      description: "Entry draw and immediate paid activation enable singing.",
      load: () =>
        loadAndValidateFixture("set14-audit-guitar-entry", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditGuitarEntryFixture),
        ),
    },
    {
      id: "set14-audit-never-apart-empty",
      name: "Hyperia audit: Never Too Far Apart empty deck",
      description: "Resolve top-nine effect with a empty deck.",
      load: () =>
        loadAndValidateFixture("set14-audit-never-apart-empty", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditNeverApartEmptyFixture),
        ),
    },
    {
      id: "set14-audit-never-apart-player-two",
      name: "Hyperia audit: set14-audit-never-apart-player-two",
      description: "Player-two Singer selection and public reveal boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-never-apart-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditNeverApartPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-never-apart-unavailable-player-two",
      name: "Hyperia audit: set14-audit-never-apart-unavailable-player-two",
      description: "Player-two Singer selection and public reveal boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-never-apart-unavailable-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditNeverApartUnavailablePlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-never-apart-sung",
      name: "Hyperia audit: Never Too Far Apart sung",
      description: "Exact Sing Together nine; three-card cap and optional zero.",
      load: () =>
        loadAndValidateFixture("set14-audit-never-apart-sung", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditNeverApartSungFixture),
        ),
    },
    {
      id: "set14-audit-never-apart",
      name: "Hyperia audit: Never Too Far Apart",
      description: "Top-nine Singer selection, public reveal and chosen bottom order.",
      load: () =>
        loadAndValidateFixture("set14-audit-never-apart", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditNeverApartFixture),
        ),
    },
    {
      id: "set14-audit-shed-load-player-two",
      name: "Hyperia audit: Shed Load Player-two mixed reveal and repeat",
      description: "Public reveal and complete non-character discard boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-shed-load-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditShedLoadPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-shed-load-empty-player-two",
      name: "Hyperia audit: Shed Load Player-two empty hand",
      description: "Public reveal and complete non-character discard boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-shed-load-empty-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditShedLoadEmptyPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-shed-load-all-non-character",
      name: "Hyperia audit: Shed Load All non-characters discard",
      description: "Public reveal and complete non-character discard boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-shed-load-all-non-character", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditShedLoadAllNonCharacterFixture,
          ),
        ),
    },
    {
      id: "set14-audit-shed-load",
      name: "Hyperia audit: Shed Your Weary Load",
      description: "Full opponent hand reveal and all non-character discard; paid and sung paths.",
      load: () =>
        loadAndValidateFixture("set14-audit-shed-load", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditShedLoadFixture),
        ),
    },
    {
      id: "set14-audit-goofy-copies",
      name: "Hyperia audit: Goofy copies",
      description: "Other-character exclusion, stacked Singer lore and expiry.",
      load: () =>
        loadAndValidateFixture("set14-audit-goofy-copies", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditGoofyCopiesFixture),
        ),
    },
    {
      id: "set14-audit-abby-empty-deck",
      name: "Hyperia audit: Abby Park empty deck",
      description: "Play Abby with an empty deck, then pass to check defeat.",
      load: () =>
        loadAndValidateFixture("set14-audit-abby-empty-deck", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditAbbyEmptyDeckFixture),
        ),
    },
    {
      id: "set14-audit-abby-types-player-two",
      name: "Hyperia audit: set14-audit-abby-types-player-two",
      description: "Abby printed ability boundary checks.",
      load: () =>
        loadAndValidateFixture("set14-audit-abby-types-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditAbbyTypesPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-abby-single-player-two",
      name: "Hyperia audit: set14-audit-abby-single-player-two",
      description: "Abby printed ability boundary checks.",
      load: () =>
        loadAndValidateFixture("set14-audit-abby-single-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditAbbySinglePlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-abby",
      name: "Hyperia audit: Abby Park",
      description: "Non-match, optional song hand route, declined Singer bottom route.",
      load: () =>
        loadAndValidateFixture("set14-audit-abby", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditAbbyFixture),
        ),
    },
    {
      id: "set14-audit-abby-singer",
      name: "Hyperia audit: Abby Park Singer",
      description: "Accepted Singer and declined song with public reveal logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-abby-singer", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditAbbySingerFixture),
        ),
    },
    {
      id: "set14-audit-heihei-dry-copies",
      name: "Hyperia audit: set14-audit-heihei-dry-copies",
      description: "Heihei printed ability boundary checks.",
      load: () =>
        loadAndValidateFixture("set14-audit-heihei-dry-copies", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditHeiheiDryCopiesFixture),
        ),
    },
    {
      id: "set14-audit-heihei-no-destination-player-two",
      name: "Hyperia audit: set14-audit-heihei-no-destination-player-two",
      description: "Heihei printed ability boundary checks.",
      load: () =>
        loadAndValidateFixture("set14-audit-heihei-no-destination-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditHeiheiNoDestinationPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-heihei",
      name: "Hyperia audit: Heihei",
      description: "Free movement, another own location, conditional lore and turn reset.",
      load: () =>
        loadAndValidateFixture("set14-audit-heihei", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditHeiheiFixture),
        ),
    },
    {
      id: "set14-audit-beanstalk",
      name: "Hyperia audit: The Beanstalk",
      description: "Movement, live Strength/Evasive, combat and source removal.",
      load: () =>
        loadAndValidateFixture("set14-audit-beanstalk", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditBeanstalkFixture),
        ),
    },
    {
      id: "set14-audit-heihei-exerted",
      name: "Hyperia audit: Heihei exerted free movement",
      description: "Move for free while exerted and gain one lore.",
      load: () =>
        loadAndValidateFixture("set14-audit-heihei-exerted", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditHeiheiExertedFixture),
        ),
    },
    {
      id: "set14-audit-beanstalk-drops",
      name: "Hyperia audit: Beanstalk saved-drop movement",
      description: "Pay a saved drop to move and gain Strength and Evasive.",
      load: () =>
        loadAndValidateFixture("set14-audit-beanstalk-drops", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditBeanstalkDropsFixture),
        ),
    },
    {
      id: "set14-audit-cheese-empty-deck",
      name: "Hyperia audit: Cheese empty-deck trade",
      description: "Accept the trade and discard an existing card despite an empty deck.",
      load: () =>
        loadAndValidateFixture("set14-audit-cheese-empty-deck", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditCheeseEmptyDeckFixture),
        ),
    },
    {
      id: "set14-audit-cheese",
      name: "Hyperia audit: Leaning Tower of Cheese-a",
      description: "Optional trade, dynamic four-item Ward and own/opposing targets.",
      load: () =>
        loadAndValidateFixture("set14-audit-cheese", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditCheeseFixture),
        ),
    },
    {
      id: "set14-audit-city-guide-win",
      name: "Hyperia audit: Belle's City Guide victory",
      description: "Activate after an action to reach twenty lore and win.",
      load: () =>
        loadAndValidateFixture("set14-audit-city-guide-win", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditCityGuideWinFixture),
        ),
    },
    {
      id: "set14-audit-city-guide",
      name: "Hyperia audit: Belle’s City Guide",
      description: "Exert cost, conditional lore, same-turn item use and next-turn reset.",
      load: () =>
        loadAndValidateFixture("set14-audit-city-guide", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditCityGuideFixture),
        ),
    },
    {
      id: "set14-audit-chemical-empty-hand",
      name: "Hyperia audit: Chemical Reaction empty opposing hand",
      description: "Draw and banish an item without blocking on an empty opposing hand.",
      load: () =>
        loadAndValidateFixture("set14-audit-chemical-empty-hand", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditChemicalEmptyHandFixture),
        ),
    },
    {
      id: "set14-audit-chemical-reaction",
      name: "Hyperia audit: Chemical Reaction optional chain",
      description:
        "Draw first, optional own-item banish, opponent selection and mandatory opposing discard.",
      load: () =>
        loadAndValidateFixture("set14-audit-chemical-reaction", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditChemicalFixture),
        ),
    },
    {
      id: "set14-audit-flippant-taunt-expiry",
      name: "Hyperia audit: Flippant Taunt expiry after surviving challenge",
      description: "Surviving challenge, caster-turn expiry and normal next quest.",
      load: () =>
        loadAndValidateFixture("set14-audit-flippant-taunt-expiry", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditTauntExpiryFixture),
        ),
    },
    {
      id: "set14-audit-taunt-no-target",
      name: "Hyperia audit: Flippant Taunt no legal target",
      description: "Resolve without a keyword grant against Ward, an item and a location.",
      load: () =>
        loadAndValidateFixture("set14-audit-taunt-no-target", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditTauntNoTargetFixture),
        ),
    },
    {
      id: "set14-audit-taunt-drops",
      name: "Hyperia audit: Flippant Taunt saved-drop payment",
      description: "Pay one saved ink drop to grant opposing Jock Reckless.",
      load: () =>
        loadAndValidateFixture("set14-audit-taunt-drops", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditTauntDropsFixture),
        ),
    },
    {
      id: "set14-audit-flippant-taunt",
      name: "Hyperia audit: Flippant Taunt Reckless duration",
      description: "Opponent-only target, Reckless actions and next-own-turn expiry.",
      load: () =>
        loadAndValidateFixture("set14-audit-flippant-taunt", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditTauntFixture),
        ),
    },
    {
      id: "set14-audit-business-empty-deck",
      name: "Hyperia audit: This Is Business empty deck",
      description: "Award two drops despite an empty deck, then verify turn-end defeat.",
      load: () =>
        loadAndValidateFixture("set14-audit-business-empty-deck", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditBusinessEmptyDeckFixture),
        ),
    },
    {
      id: "set14-audit-business-empty-hand",
      name: "Hyperia audit: This Is Business empty opposing hand",
      description: "Reveal an empty hand and gain two opposing ink drops.",
      load: () =>
        loadAndValidateFixture("set14-audit-business-empty-hand", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditBusinessEmptyHandFixture),
        ),
    },
    {
      id: "set14-audit-this-is-business",
      name: "Hyperia audit: This Is Business opponent choices",
      description:
        "Opponent mode choice, caster discard choice, both drop reward paths and privacy.",
      load: () =>
        loadAndValidateFixture("set14-audit-this-is-business", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditBusinessFixture),
        ),
    },
    {
      id: "set14-audit-tale-empty-deck",
      name: "Hyperia audit: Another Tale empty deck",
      description: "Award both drops despite an empty deck, then verify turn-end defeat.",
      load: () =>
        loadAndValidateFixture("set14-audit-tale-empty-deck", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditTaleEmptyDeckFixture),
        ),
    },
    {
      id: "set14-audit-another-tale",
      name: "Hyperia audit: Another Tale to Spin shared drops",
      description:
        "Paid/sung draw, other-player selector, both drop awards and saved-drop payment.",
      load: () =>
        loadAndValidateFixture("set14-audit-another-tale", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditTaleFixture),
        ),
    },
    {
      id: "set14-audit-crowd-empty-deck",
      name: "Hyperia audit: Above the Crowd empty deck",
      description: "Bottom an opposing character into an empty deck.",
      load: () =>
        loadAndValidateFixture("set14-audit-crowd-empty-deck", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditCrowdEmptyDeckFixture),
        ),
    },
    {
      id: "set14-audit-crowd-boosted-player-two",
      name: "Hyperia audit: Above the Crowd current Strength",
      description: "Boosted exclusion, reduced acceptance, exact opposing copy and saved drops.",
      load: () =>
        loadAndValidateFixture("set14-audit-crowd-boosted-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditCrowdBoostedPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-above-crowd",
      name: "Hyperia audit: Above the Crowd current strength",
      description: "Current-strength and Ward target limits; bank and sung deck-bottom removal.",
      load: () =>
        loadAndValidateFixture("set14-audit-above-crowd", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditAboveCrowdFixture),
        ),
    },
    {
      id: "set14-audit-air-drop-healed",
      name: "Hyperia audit: Air Drop after healing",
      description: "Heal a target to zero and verify Air Drop deals three, not five.",
      load: () =>
        loadAndValidateFixture("set14-audit-air-drop-healed", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditAirDropHealedFixture),
        ),
    },
    {
      id: "set14-audit-air-drop-resisted-player-two",
      name: "Hyperia audit: Air Drop fully resisted repeats",
      description: "Player Two damage boundary and saved-drop payment with both log views.",
      load: () =>
        loadAndValidateFixture("set14-audit-air-drop-resisted-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditAirDropResistedPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-air-drop-no-target-player-two",
      name: "Hyperia audit: Air Drop no legal character",
      description: "Player Two damage boundary and saved-drop payment with both log views.",
      load: () =>
        loadAndValidateFixture("set14-audit-air-drop-no-target-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditAirDropNoTargetPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-business-player-two-persistence",
      name: "Hyperia audit: Business reversed choices and persistence",
      description:
        "Player Two casts both modes; opposite choosers, saved rewards and later payment.",
      load: () =>
        loadAndValidateFixture("set14-audit-business-player-two-persistence", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditBusinessPlayerTwoPersistenceFixture,
          ),
        ),
    },
    {
      id: "set14-audit-air-drop",
      name: "Hyperia audit: Air Drop conditional damage",
      description: "Three/five damage, lethal outcomes, Ward and Resist with exact logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-air-drop", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditAirDropFixture),
        ),
    },
    {
      id: "set14-audit-honey-empty-deck",
      name: "Hyperia audit: Honey reward with an empty deck",
      description: "Banish an item with no deck cards and verify the drop and turn-end loss.",
      load: () =>
        loadAndValidateFixture("set14-audit-honey-empty-deck", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditHoneyEmptyDeckFixture),
        ),
    },
    {
      id: "set14-audit-honey-no-item",
      name: "Hyperia audit: Honey without an own item",
      description: "An opposing item cannot pay Honey's banishment cost.",
      load: () =>
        loadAndValidateFixture("set14-audit-honey-no-item", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditHoneyNoItemFixture),
        ),
    },
    {
      id: "set14-audit-honey-repeated-player-two",
      name: "Hyperia audit: Honey repeated Player Two rewards",
      description: "Repeated quests, own-item restrictions and saved drops after source removal.",
      load: () =>
        loadAndValidateFixture("set14-audit-honey-repeated-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditHoneyRepeatedPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-honey-lemon",
      name: "Hyperia audit: Honey Lemon item rewards",
      description: "Play/quest own-item banishment, decline, private draw and drop payment.",
      load: () =>
        loadAndValidateFixture("set14-audit-honey-lemon", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditHoneyLemonFixture),
        ),
    },
    {
      id: "set14-audit-minnie-effect",
      name: "Hyperia audit: Minnie prevents action damage",
      description: "Deal two action damage to opposing Minnie and verify Resist.",
      load: () =>
        loadAndValidateFixture("set14-audit-minnie-effect", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMinnieEffectFixture),
        ),
    },
    {
      id: "set14-audit-minnie-resist",
      name: "Hyperia audit: Minnie opponent-turn Resist",
      description: "Zero/one combat damage, turn-limited Resist and reciprocal logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-minnie-resist", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMinnieResistFixture),
        ),
    },
    {
      id: "set14-audit-fred-quest",
      name: "Hyperia audit: Fred quest leaves locations",
      description: "Quest Fred for two lore without banishing a location.",
      load: () =>
        loadAndValidateFixture("set14-audit-fred-quest", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditFredQuestFixture),
        ),
    },
    {
      id: "set14-audit-fred-no-location",
      name: "Hyperia audit: Fred without locations",
      description: "Play Fred without locations and check the no-target result.",
      load: () =>
        loadAndValidateFixture("set14-audit-fred-no-location", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditFredNoLocationFixture),
        ),
    },
    {
      id: "set14-audit-fred-stomper-occupied",
      name: "Hyperia audit: Fred occupied-location banishment",
      description:
        "Own/opposing occupied locations, surviving exact occupants, decline and chooser ownership.",
      load: () =>
        loadAndValidateFixture("set14-audit-fred-stomper-occupied", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditFredStomperOccupiedFixture,
          ),
        ),
    },
    {
      id: "set14-audit-fred-stomper",
      name: "Hyperia audit: Fred location banishment",
      description: "Own/opposing location banishment, decline and target filtering.",
      load: () =>
        loadAndValidateFixture("set14-audit-fred-stomper", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditFredStomperFixture),
        ),
    },
    {
      id: "set14-audit-belle-singing",
      name: "Hyperia audit: Belle singing discount",
      description: "Sing with Belle and discount the next action by two ink.",
      load: () =>
        loadAndValidateFixture("set14-audit-belle-singing", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditBelleSingingFixture),
        ),
    },
    {
      id: "set14-audit-belle-stacked",
      name: "Hyperia audit: Belle stacked discounts",
      description: "Two Belles discount exactly one action by four ink.",
      load: () =>
        loadAndValidateFixture("set14-audit-belle-stacked", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditBelleStackedFixture),
        ),
    },
    {
      id: "set14-audit-belle-challenge",
      name: "Hyperia audit: Belle challenge discount",
      description: "Challenge with Belle and verify the next action costs two less.",
      load: () =>
        loadAndValidateFixture("set14-audit-belle-challenge", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditBelleChallengeFixture),
        ),
    },
    {
      id: "set14-audit-belle-writer-opponent-exert",
      name: "Hyperia audit: Belle opponent-turn exertion",
      description:
        "Exact copies ignore opposing exertions/actions, then grant own-turn discount and third-action rewards.",
      load: () =>
        loadAndValidateFixture("set14-audit-belle-writer-opponent-exert", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditBelleWriterOpponentExertFixture,
          ),
        ),
    },
    {
      id: "set14-audit-belle-writer",
      name: "Hyperia audit: Belle discounts and third action",
      description: "Shift, next-action cost reduction and exact third-action lore.",
      load: () =>
        loadAndValidateFixture("set14-audit-belle-writer", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditBelleWriterFixture),
        ),
    },
    {
      id: "set14-audit-max-empty-deck",
      name: "Hyperia audit: Max draws from an empty deck",
      description: "Discard a song, draw no cards, then pass to check the empty-deck loss.",
      load: () =>
        loadAndValidateFixture("set14-audit-max-empty-deck", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMaxEmptyDeckFixture),
        ),
    },
    {
      id: "set14-audit-max-short-deck",
      name: "Hyperia audit: Max draws from a short deck",
      description:
        "Discard a song, draw one available card, then pass to check the empty-deck loss.",
      load: () =>
        loadAndValidateFixture("set14-audit-max-short-deck", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMaxShortDeckFixture),
        ),
    },
    {
      id: "set14-audit-max-karaoke",
      name: "Hyperia audit: Max song discard and live lore",
      description:
        "Accept/decline, song-only discard, private draw and five-song threshold removal.",
      load: () =>
        loadAndValidateFixture("set14-audit-max-karaoke", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMaxKaraokeFixture),
        ),
    },
    {
      id: "set14-audit-don-karnage-player-two-removal",
      name: "Hyperia audit: Don Karnage independent source removal",
      description: "Two/one/zero exact sources, live damaged-character lore and actual quest logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-don-karnage-player-two-removal", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditDonKarnagePlayerTwoRemovalFixture,
          ),
        ),
    },
    {
      id: "set14-audit-don-karnage",
      name: "Hyperia audit: Don Karnage damage and lore",
      description: "Shift, Ward/Resist area damage, fatal damage and live lore modifiers.",
      load: () =>
        loadAndValidateFixture("set14-audit-don-karnage", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditDonKarnageFixture),
        ),
    },
    {
      id: "set14-audit-lester-lore-floor",
      name: "Hyperia audit: Lester lore floor",
      description: "Defender banish clamps one opposing lore to zero.",
      load: () =>
        loadAndValidateFixture("set14-audit-lester-lore-floor", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditLesterLoreFloorFixture),
        ),
    },
    {
      id: "set14-audit-karnage-negative-lore",
      name: "Hyperia audit: Don Karnage negative quest lore",
      description: "Stacked opposing sources grant zero lore on a negative-lore quest.",
      load: () =>
        loadAndValidateFixture("set14-audit-karnage-negative-lore", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditKarnageNegativeLoreFixture,
          ),
        ),
    },
    {
      id: "set14-audit-lester",
      name: "Hyperia audit: Lester Reckless and defender banish",
      description: "Bank/drop activations, Reckless target limits and defender lore loss.",
      load: () =>
        loadAndValidateFixture("set14-audit-lester", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditLesterFixture),
        ),
    },
    {
      id: "set14-audit-lester-attacking",
      name: "Hyperia audit: Lester attacking banish exclusion",
      description: "Attacker banishment must not lose opponent lore.",
      load: () =>
        loadAndValidateFixture("set14-audit-lester-attacking", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditLesterAttackingFixture),
        ),
    },
    {
      id: "set14-audit-fred-boss-unaffordable",
      name: "Hyperia audit: Fred insufficient Shift payment",
      description: "Three bank ink cannot pay Shift four without saved drops.",
      load: () =>
        loadAndValidateFixture("set14-audit-fred-boss-unaffordable", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditFredBossUnaffordableFixture,
          ),
        ),
    },
    {
      id: "set14-audit-fred-boss-player-two-removal",
      name: "Hyperia audit: Fred Boss Player Two source removal",
      description:
        "Own-name Shift filters, exact copies, Super/type/owner limits and independent source removal.",
      load: () =>
        loadAndValidateFixture("set14-audit-fred-boss-player-two-removal", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditFredBossPlayerTwoRemovalFixture,
          ),
        ),
    },
    {
      id: "set14-audit-fred-boss",
      name: "Hyperia audit: Fred Super play rewards and Shift",
      description:
        "Shift, independent sources, Super character/item limits and saved-drop payment.",
      load: () =>
        loadAndValidateFixture("set14-audit-fred-boss", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditFredBossFixture),
        ),
    },
    {
      id: "set14-audit-baymax-three-items",
      name: "Hyperia audit: Baymax three-item reward",
      description: "Three own items award exactly two Ink Drops.",
      load: () =>
        loadAndValidateFixture("set14-audit-baymax-three-items", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditBaymaxThreeItemsFixture),
        ),
    },
    {
      id: "set14-audit-baymax-lab-player-two",
      name: "Hyperia audit: Baymax Lab Player Two timing",
      description:
        "Zero own items, late-item exclusion, entry threshold, quest non-trigger and saved-drop payment.",
      load: () =>
        loadAndValidateFixture("set14-audit-baymax-lab-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditBaymaxLabPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-baymax-lab",
      name: "Hyperia audit: Baymax item threshold",
      description: "Two own items, threshold loss, opponent exclusion and saved-drop payment.",
      load: () =>
        loadAndValidateFixture("set14-audit-baymax-lab", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditBaymaxLabFixture),
        ),
    },
    {
      id: "set14-audit-bobby-drop-only",
      name: "Hyperia audit: Bobby drop-only activation",
      description: "Saved drops make a granted activation available at bank zero.",
      load: () =>
        loadAndValidateFixture("set14-audit-bobby-drop-only", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditBobbyDropOnlyFixture),
        ),
    },
    {
      id: "set14-audit-bobby-ward",
      name: "Hyperia audit: Bobby opposing Ward",
      description: "Opposing Bobby is excluded from chosen effect targets.",
      load: () =>
        loadAndValidateFixture("set14-audit-bobby-ward", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditBobbyWardFixture),
        ),
    },
    {
      id: "set14-audit-bobby-copies-player-two",
      name: "Hyperia audit: Bobby copies and independent grants",
      description: "Two copies, one-drop rewards, first and last source removal.",
      load: () =>
        loadAndValidateFixture("set14-audit-bobby-copies-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditBobbyCopiesPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-bobby",
      name: "Hyperia audit: Bobby granted drop ability",
      description: "Granted item activation, ink and exert costs, and source removal.",
      load: () =>
        loadAndValidateFixture("set14-audit-bobby", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditBobbyFixture),
        ),
    },
    {
      id: "set14-audit-ruthless-quest",
      name: "Hyperia audit: Ruthless Shere Khan quest",
      description: "Quest does not trigger the play-only removal ability.",
      load: () =>
        loadAndValidateFixture("set14-audit-ruthless-quest", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditRuthlessQuestFixture),
        ),
    },
    {
      id: "set14-audit-ruthless-player-two",
      name: "Hyperia audit: Ruthless Shere Khan boosted strength and no target",
      description:
        "Current boosted strength exclusion, player-two deck destination and empty chooser completion.",
      load: () =>
        loadAndValidateFixture("set14-audit-ruthless-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditRuthlessPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-ruthless",
      name: "Hyperia audit: Shere Khan current strength",
      description: "Current strength and opponent-only deck-bottom choices.",
      load: () =>
        loadAndValidateFixture("set14-audit-ruthless", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditRuthlessFixture),
        ),
    },
    {
      id: "set14-audit-horace-no-target",
      name: "Hyperia audit: Horace no damaged target",
      description: "No damage choice against healthy opposing characters.",
      load: () =>
        loadAndValidateFixture("set14-audit-horace-no-target", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditHoraceNoTargetFixture),
        ),
    },
    {
      id: "set14-audit-horace",
      name: "Hyperia audit: Horace damaged opponents",
      description: "Opponent-only damaged targets, Ward and lethal damage logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-horace", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditHoraceFixture),
        ),
    },
    {
      id: "set14-audit-shere-khan-empty-hand",
      name: "Hyperia audit: Shere Khan empty opposing hand",
      description: "Empty opposing hand awards exactly one Ink Drop.",
      load: () =>
        loadAndValidateFixture("set14-audit-shere-khan-empty-hand", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditShereKhanEmptyHandFixture),
        ),
    },
    {
      id: "set14-audit-shere-khan",
      name: "Hyperia audit: Shere Khan discard or drop",
      description: "Opponent discard choices, persistent rewards and drop payment.",
      load: () =>
        loadAndValidateFixture("set14-audit-shere-khan", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditShereKhanFixture),
        ),
    },
    {
      id: "set14-audit-rebecca-empty-player-two",
      name: "Hyperia audit: Rebecca Player Two empty",
      description: "Player Two optional draw and mandatory discard audit.",
      load: () =>
        loadAndValidateFixture("set14-audit-rebecca-empty-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditRebeccaEmptyPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-rebecca-no-hand-player-two",
      name: "Hyperia audit: Rebecca Player Two no-hand",
      description: "Player Two optional draw and mandatory discard audit.",
      load: () =>
        loadAndValidateFixture("set14-audit-rebecca-no-hand-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditRebeccaNoHandPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-rebecca-only-hand",
      name: "Hyperia audit: Rebecca only-hand discard",
      description: "Accepted draw must be discarded when it is the only hand card.",
      load: () =>
        loadAndValidateFixture("set14-audit-rebecca-only-hand", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditRebeccaOnlyHandFixture),
        ),
    },
    {
      id: "set14-audit-rebecca",
      name: "Hyperia audit: Rebecca draw and discard",
      description: "Repeated optional draws and own-hand discard choices.",
      load: () =>
        loadAndValidateFixture("set14-audit-rebecca", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditRebeccaFixture),
        ),
    },
    {
      id: "set14-audit-lady",
      name: "Hyperia audit: Lady Ward",
      description: "Own/opposing effects, challenges and non-chosen damage.",
      load: () =>
        loadAndValidateFixture("set14-audit-lady", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditLadyFixture),
        ),
    },
    {
      id: "set14-audit-jock-plain-challenge",
      name: "Hyperia audit: Jock challenges a non-Evasive character",
      description:
        "Evasive outgoing challenge against ordinary Scuttle with exact damage and logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-jock-plain-challenge", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditJockPlainChallengeFixture),
        ),
    },
    {
      id: "set14-audit-hook-jock",
      name: "Hyperia audit: Hook and Jock",
      description: "Printed vanilla stats and Evasive challenge limits.",
      load: () =>
        loadAndValidateFixture("set14-audit-hook-jock", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditHookJockFixture),
        ),
    },
    {
      id: "set14-audit-fred",
      name: "Hyperia audit: Fred team selection",
      description: "Super-character/item choice and bottom ordering.",
      load: () =>
        loadAndValidateFixture("set14-audit-fred", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditFredFixture),
        ),
    },
    {
      id: "set14-audit-belle-player-two",
      name: "Hyperia audit: Belle player-two action and optional destinations",
      description: "Non-song action, named item declines, player-two ownership and empty deck.",
      load: () =>
        loadAndValidateFixture("set14-audit-belle-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditBellePlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-belle",
      name: "Hyperia audit: Belle reveal and named item",
      description: "Public reveals, correct named-item filter, and bottom placement.",
      load: () =>
        loadAndValidateFixture("set14-audit-belle", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditBelleFixture),
        ),
    },
    {
      id: "set14-audit-belle-song",
      name: "Hyperia audit: Belle song reveal and decline",
      description: "Reveal songs, take the first and decline the second.",
      load: () =>
        loadAndValidateFixture("set14-audit-belle-song", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditBelleSongFixture),
        ),
    },
    {
      id: "set14-audit-molly-kit-player-two",
      name: "Hyperia audit: Molly and Kit Player Two shared drops",
      description:
        "Controller-only other-player choice, exact copies, shared rewards, persistence and spending.",
      load: () =>
        loadAndValidateFixture("set14-audit-molly-kit-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMollyKitPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-molly-kit",
      name: "Hyperia audit: Molly and Kit other-player drops",
      description: "One drop per controller and other chosen player.",
      load: () =>
        loadAndValidateFixture("set14-audit-molly-kit", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMollyKitFixture),
        ),
    },
    {
      id: "set14-audit-hiro-versatile-player-two",
      name: "Hyperia audit: Hiro Versatile Player Two",
      description: "Own-character Evasive choice, extra payment, duration and printed keyword.",
      load: () =>
        loadAndValidateFixture("set14-audit-hiro-versatile-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditHiroVersatilePlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-hiro-versatile-no-ink",
      name: "Hyperia audit: Hiro Versatile no extra ink",
      description: "Own-character Evasive choice, extra payment, duration and printed keyword.",
      load: () =>
        loadAndValidateFixture("set14-audit-hiro-versatile-no-ink", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditHiroVersatileNoInkFixture),
        ),
    },
    {
      id: "set14-audit-go-go-extreme-player-two",
      name: "Hyperia audit: Go Go Extreme Player Two",
      description:
        "Repeated defending drops, illegal/offensive exclusions, lethal and saved-drop payment.",
      load: () =>
        loadAndValidateFixture("set14-audit-go-go-extreme-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditGoGoExtremePlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-hiro-gogo",
      name: "Hyperia audit: Hiro Evasive and Go Go challenge drops",
      description:
        "Temporary Evasive payment and repeated challenge drops, including lethal damage.",
      load: () =>
        loadAndValidateFixture("set14-audit-hiro-gogo", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditHiroGoGoFixture),
        ),
    },
    {
      id: "set14-audit-skates-player-two",
      name: "Hyperia audit: Inkcaster Skates Player Two",
      description:
        "Independent exertion costs, controller reward/payment, prior-turn exclusion and reset.",
      load: () =>
        loadAndValidateFixture("set14-audit-skates-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditSkatesPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-market-player-two",
      name: "Hyperia audit: Magical Market Player Two",
      description: "Printed movement reward, ownership, timing and draw boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-market-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMarketPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-market-opposing-move",
      name: "Hyperia audit: Magical Market opposing-turn diagnostic",
      description: "Printed movement reward, ownership, timing and draw boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-market-opposing-move", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMarketOpposingMoveFixture),
        ),
    },
    {
      id: "set14-audit-market-empty-deck",
      name: "Hyperia audit: Magical Market empty deck",
      description: "Printed movement reward, ownership, timing and draw boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-market-empty-deck", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMarketEmptyDeckFixture),
        ),
    },
    {
      id: "set14-audit-skates-market",
      name: "Hyperia audit: Skates drops and Market movement",
      description: "Quest-gated drop payment and the Market's once-per-turn reward.",
      load: () =>
        loadAndValidateFixture("set14-audit-skates-market", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditSkatesMarketFixture),
        ),
    },
    {
      id: "set14-audit-creative",
      name: "Hyperia audit: Creative Inspiration exact draw",
      description: "Four-card draw and its visible log.",
      load: () =>
        loadAndValidateFixture("set14-audit-creative", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditCreativeFixture),
        ),
    },
    {
      id: "set14-audit-wand-versions-player-two",
      name: "Hyperia audit: Wand Player Two versions",
      description: "Player Two Magic Touch reveal and discount audit.",
      load: () =>
        loadAndValidateFixture("set14-audit-wand-versions-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditWandVersionsPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-wand-expiry-player-two",
      name: "Hyperia audit: Wand Player Two expiry",
      description: "Player Two Magic Touch reveal and discount audit.",
      load: () =>
        loadAndValidateFixture("set14-audit-wand-expiry-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditWandExpiryPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-wand-invalid-player-two",
      name: "Hyperia audit: Wand Player Two invalid",
      description: "Player Two Magic Touch reveal and discount audit.",
      load: () =>
        loadAndValidateFixture("set14-audit-wand-invalid-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditWandInvalidPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-wand",
      name: "Hyperia audit: Merlin's Wand reveal cost",
      description: "Same-name reveal cost and single-use discount.",
      load: () =>
        loadAndValidateFixture("set14-audit-wand", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditWandFixture),
        ),
    },
    {
      id: "set14-audit-magnificent",
      name: "Hyperia audit: Magnificent lore and draw",
      description: "Paid and sung lore gain and card draw.",
      load: () =>
        loadAndValidateFixture("set14-audit-magnificent", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMagnificentFixture),
        ),
    },
    {
      id: "set14-audit-poco-loco",
      name: "Hyperia audit: Un Poco Loco chosen pair",
      description: "Sing Together, own-character selection and conditional return.",
      load: () =>
        loadAndValidateFixture("set14-audit-poco-loco", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditPocoLocoFixture),
        ),
    },
    {
      id: "set14-audit-malice-figitus",
      name: "Hyperia audit: Mim damage and Figitus drop payment",
      description: "Chosen damage amount, song grant of three drops, and immediate payment.",
      load: () =>
        loadAndValidateFixture("set14-audit-malice-figitus", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMaliceFigitusFixture),
        ),
    },
    {
      id: "set14-audit-loyal-dante-combat",
      name: "Hyperia audit: Loyal Dante Evasive",
      description: "Evasive legality and six-strength retaliation.",
      load: () =>
        loadAndValidateFixture("set14-audit-loyal-dante-combat", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditLoyalDanteCombatFixture),
        ),
    },
    {
      id: "set14-audit-creative-mixed-player-two",
      name: "Hyperia audit: Creative Player Two mixed",
      description: "Player Two exact draw and payment audit.",
      load: () =>
        loadAndValidateFixture("set14-audit-creative-mixed-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditCreativeMixedPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-creative-empty-player-two",
      name: "Hyperia audit: Creative Player Two empty",
      description: "Player Two exact draw and payment audit.",
      load: () =>
        loadAndValidateFixture("set14-audit-creative-empty-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditCreativeEmptyPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-creative-short-deck",
      name: "Hyperia audit: player-two Creative short deck",
      description: "Draw remaining two and verify own-turn-end empty-deck loss.",
      load: () =>
        loadAndValidateFixture("set14-audit-creative-short-deck", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditCreativeShortDeckFixture),
        ),
    },
    {
      id: "set14-audit-magnificent-empty-player-two",
      name: "Hyperia audit: Magnificent Player Two empty",
      description: "Player Two lore and draw boundary audit.",
      load: () =>
        loadAndValidateFixture("set14-audit-magnificent-empty-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditMagnificentEmptyPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-magnificent-rejected-player-two",
      name: "Hyperia audit: Magnificent Player Two rejected",
      description: "Player Two lore and draw boundary audit.",
      load: () =>
        loadAndValidateFixture("set14-audit-magnificent-rejected-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditMagnificentRejectedPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-magnificent-player-two",
      name: "Hyperia audit: player-two Magnificent lore and draw",
      description: "Paid and sung two-lore one-card effects from player two.",
      load: () =>
        loadAndValidateFixture("set14-audit-magnificent-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditMagnificentPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-poco-boundary-player-two",
      name: "Hyperia audit: Poco Player Two boundary",
      description: "Player Two conditional return audit.",
      load: () =>
        loadAndValidateFixture("set14-audit-poco-boundary-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditPocoBoundaryPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-poco-only-player-two",
      name: "Hyperia audit: Poco Player Two only",
      description: "Player Two conditional return audit.",
      load: () =>
        loadAndValidateFixture("set14-audit-poco-only-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditPocoOnlyPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-poco-empty-player-two",
      name: "Hyperia audit: Poco Player Two empty",
      description: "Player Two conditional return audit.",
      load: () =>
        loadAndValidateFixture("set14-audit-poco-empty-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditPocoEmptyPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-poco-player-two",
      name: "Hyperia audit: player-two Un Poco Loco",
      description: "Sing Together at exact cost three and return both singers.",
      load: () =>
        loadAndValidateFixture("set14-audit-poco-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditPocoPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-higitus-paid-player-two",
      name: "Hyperia audit: Higitus Player Two paid",
      description: "Player Two ink-drop gain and payment audit.",
      load: () =>
        loadAndValidateFixture("set14-audit-higitus-paid-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditHigitusPaidPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-higitus-insufficient-player-two",
      name: "Hyperia audit: Higitus Player Two insufficient",
      description: "Player Two ink-drop gain and payment audit.",
      load: () =>
        loadAndValidateFixture("set14-audit-higitus-insufficient-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditHigitusInsufficientPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-higitus-player-two",
      name: "Hyperia audit: player-two Higitus persistence",
      description: "Sing at zero ink and retain two unspent drops across turns.",
      load: () =>
        loadAndValidateFixture("set14-audit-higitus-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditHigitusPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-malice-amounts-player-two",
      name: "Hyperia audit: Malice Player Two amounts",
      description: "Player Two damage movement and public logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-malice-amounts-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditMaliceAmountsPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-malice-zero-player-two",
      name: "Hyperia audit: Malice Player Two zero",
      description: "Player Two damage movement and public logs.",
      load: () =>
        loadAndValidateFixture("set14-audit-malice-zero-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditMaliceZeroPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-malice-player-two",
      name: "Hyperia audit: player-two Malice lethal movement",
      description: "Opposing source and destination with lethal damage movement.",
      load: () =>
        loadAndValidateFixture("set14-audit-malice-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMalicePlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-juanita-boundary-player-two",
      name: "Hyperia audit: Juanita Player Two discard boundary",
      description: "Player Two draw branch and public log audit.",
      load: () =>
        loadAndValidateFixture("set14-audit-juanita-boundary-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditJuanitaBoundaryPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-juanita-short-player-two",
      name: "Hyperia audit: Juanita Player Two short deck",
      description: "Player Two draw branch and public log audit.",
      load: () =>
        loadAndValidateFixture("set14-audit-juanita-short-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditJuanitaShortPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-juanita-empty-player-two",
      name: "Hyperia audit: Juanita Player Two empty deck",
      description: "Player Two draw branch and public log audit.",
      load: () =>
        loadAndValidateFixture("set14-audit-juanita-empty-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditJuanitaEmptyPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-juanita-enhanced",
      name: "Hyperia audit: Juanita enhanced singing draw",
      description: "Ten-card discard threshold and three-card draw when sung.",
      load: () =>
        loadAndValidateFixture("set14-audit-juanita-enhanced", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditJuanitaEnhancedFixture),
        ),
    },
    {
      id: "set14-audit-dante-juanita",
      name: "Hyperia audit: Dante Shift and Juanita discard threshold",
      description: "Shift, nine-card draw boundary, and live discard lore bonus.",
      load: () =>
        loadAndValidateFixture("set14-audit-dante-juanita", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditDanteJuanitaFixture),
        ),
    },
    {
      id: "set14-audit-goliath-player-two-reset",
      name: "Hyperia audit: Goliath player-two zero and reset",
      description: "Zero movement, spent use, next-turn reset and Stone by Day threshold.",
      load: () =>
        loadAndValidateFixture("set14-audit-goliath-player-two-reset", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditGoliathPlayerTwoResetFixture,
          ),
        ),
    },
    {
      id: "set14-audit-goliath-lethal",
      name: "Hyperia audit: Goliath lethal damage move",
      description: "Two-damage movement and banishment.",
      load: () =>
        loadAndValidateFixture("set14-audit-goliath-lethal", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditGoliathLethalFixture),
        ),
    },
    {
      id: "set14-audit-dante-loyal-player-two",
      name: "Hyperia audit: Loyal Dante player-two Shift and falling threshold",
      description: "Exerted Shift inheritance and ten-to-nine own discard bonus removal.",
      load: () =>
        loadAndValidateFixture("set14-audit-dante-loyal-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditDanteLoyalPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-demona-player-two",
      name: "Hyperia audit: Demona player-two repeat and duration",
      description:
        "Gargoyle-only chooser, repeat discard costs, controller expiry and Stone by Day.",
      load: () =>
        loadAndValidateFixture("set14-audit-demona-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditDemonaPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-goliath-demona",
      name: "Hyperia audit: Goliath damage and Demona keywords",
      description: "Discard payments, chosen damage amount, Rush and Evasive.",
      load: () =>
        loadAndValidateFixture("set14-audit-goliath-demona", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditGoliathDemonaFixture),
        ),
    },
    {
      id: "set14-audit-curious-merlin-payment",
      name: "Hyperia audit: Curious Merlin payment",
      description: "Entry drop pays a card at zero ready ink.",
      load: () =>
        loadAndValidateFixture("set14-audit-curious-merlin-payment", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditCuriousMerlinPaymentFixture,
          ),
        ),
    },
    {
      id: "set14-audit-owl-defense",
      name: "Hyperia audit: Owl defending trigger",
      description: "Defending banishment gives its controller a drop.",
      load: () =>
        loadAndValidateFixture("set14-audit-owl-defense", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditOwlDefenseFixture),
        ),
    },
    {
      id: "set14-audit-merlin-owl",
      name: "Hyperia audit: Merlin quest draw and Owl challenge drop",
      description:
        "Quest draw, Rush challenge banishment, and separate source-attributed ink drops.",
      load: () =>
        loadAndValidateFixture("set14-audit-merlin-owl", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMerlinOwlFixture),
        ),
    },
    {
      id: "set14-audit-rapunzel-missing-reveal",
      name: "Hyperia audit: Rapunzel missing reveal card",
      description: "Item-only and empty hands finish without reveal or draw.",
      load: () =>
        loadAndValidateFixture("set14-audit-rapunzel-missing-reveal", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditRapunzelMissingRevealFixture,
          ),
        ),
    },
    {
      id: "set14-audit-rapunzel-player-two",
      name: "Hyperia audit: Rapunzel player-two reveal",
      description: "Friendly matching reveal, controller draw, privacy and decline.",
      load: () =>
        loadAndValidateFixture("set14-audit-rapunzel-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditRapunzelPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-rapunzel",
      name: "Hyperia audit: Rapunzel hand reveal and matching name",
      description: "Choose another character, reveal a hand character, and draw on matching name.",
      load: () =>
        loadAndValidateFixture("set14-audit-rapunzel", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditRapunzelFixture),
        ),
    },
    {
      id: "set14-audit-imelda-order-player-two",
      name: "Hyperia audit: Imelda player-two return order",
      description: "Own three-card return, draw order and opposing discard exclusion.",
      load: () =>
        loadAndValidateFixture("set14-audit-imelda-order-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditImeldaOrderPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-imelda-order",
      name: "Hyperia audit: Imelda three-card order",
      description: "Required three-card return and chosen order.",
      load: () =>
        loadAndValidateFixture("set14-audit-imelda-order", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditImeldaOrderFixture),
        ),
    },
    {
      id: "set14-audit-imelda-insufficient-player-two",
      name: "Hyperia audit: Imelda zero and one discard",
      description: "Player-two insufficient return and opposing discard exclusion.",
      load: () =>
        loadAndValidateFixture("set14-audit-imelda-insufficient-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditImeldaInsufficientPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-imelda",
      name: "Hyperia audit: Imelda's required three-card return",
      description: "Incomplete return is unavailable; opposing discard cards do not count.",
      load: () =>
        loadAndValidateFixture("set14-audit-imelda", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditImeldaFixture),
        ),
    },
    {
      id: "set14-audit-amber-items",
      name: "Hyperia audit: Singer items",
      description: "Singer gain, continuous stat bonus and singing restriction.",
      load: () =>
        loadAndValidateFixture("set14-audit-amber-items", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditAmberItemsFixture),
        ),
    },
    {
      id: "set14-audit-remember-me-player-two",
      name: "Hyperia audit: set14-audit-remember-me-player-two",
      description: "Player-two discard entry and name restrictions.",
      load: () =>
        loadAndValidateFixture("set14-audit-remember-me-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditRememberMePlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-remember-me-pair-player-two",
      name: "Hyperia audit: set14-audit-remember-me-pair-player-two",
      description: "Player-two discard entry and name restrictions.",
      load: () =>
        loadAndValidateFixture("set14-audit-remember-me-pair-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditRememberMePairPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-remember-me-half-player-two",
      name: "Hyperia audit: set14-audit-remember-me-half-player-two",
      description: "Player-two discard entry and name restrictions.",
      load: () =>
        loadAndValidateFixture("set14-audit-remember-me-half-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditRememberMeHalfPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-never-cry-player-two",
      name: "Hyperia audit: set14-audit-never-cry-player-two",
      description: "Player-two return choices and empty eligible pool.",
      load: () =>
        loadAndValidateFixture("set14-audit-never-cry-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditNeverCryPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-never-cry-no-eligible-player-two",
      name: "Hyperia audit: set14-audit-never-cry-no-eligible-player-two",
      description: "Player-two return choices and empty eligible pool.",
      load: () =>
        loadAndValidateFixture("set14-audit-never-cry-no-eligible-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditNeverCryNoEligiblePlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-guitar-player-two",
      name: "Hyperia audit: set14-audit-guitar-player-two",
      description: "Player Two Guitar draw, singing bonus and expiry.",
      load: () =>
        loadAndValidateFixture("set14-audit-guitar-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditGuitarPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-guitar-empty-player-two",
      name: "Hyperia audit: set14-audit-guitar-empty-player-two",
      description: "Player Two Guitar draw, singing bonus and expiry.",
      load: () =>
        loadAndValidateFixture("set14-audit-guitar-empty-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditGuitarEmptyPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-stack-player-two",
      name: "Hyperia audit: Speaker Stack Player Two",
      description: "Own Singer bonuses and lethal willpower removal.",
      load: () =>
        loadAndValidateFixture("set14-audit-stack-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditStackPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-stack-expiry-player-two",
      name: "Hyperia audit: Speaker Stack temporary Singer expiry",
      description: "Lethal check after temporary Singer expiry.",
      load: () =>
        loadAndValidateFixture("set14-audit-stack-expiry-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditStackExpiryPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-blessing-player-two",
      name: "Hyperia audit: Mamá Imelda's Blessing Player Two",
      description: "Player Two controller expiry and singing restrictions.",
      load: () =>
        loadAndValidateFixture("set14-audit-blessing-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditBlessingPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-port-player-two",
      name: "Hyperia audit: set14-audit-port-player-two",
      description: "Port Authority controller, timing and once-per-turn rewards.",
      load: () =>
        loadAndValidateFixture("set14-audit-port-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditPortPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-port-opposing-move",
      name: "Hyperia audit: set14-audit-port-opposing-move",
      description: "Port Authority controller, timing and once-per-turn rewards.",
      load: () =>
        loadAndValidateFixture("set14-audit-port-opposing-move", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditPortOpposingMoveFixture),
        ),
    },
    {
      id: "set14-audit-owen-player-two",
      name: "Hyperia audit: Owen Burnett Player Two item returns",
      description: "Own/opposing item return and no eligible completion.",
      load: () =>
        loadAndValidateFixture("set14-audit-owen-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditOwenPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-lexington-player-two",
      name: "Hyperia audit: set14-audit-lexington-player-two",
      description: "Lexington ready restriction and Evasive defender.",
      load: () =>
        loadAndValidateFixture("set14-audit-lexington-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditLexingtonPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-lexington-defender-player-two",
      name: "Hyperia audit: set14-audit-lexington-defender-player-two",
      description: "Lexington ready restriction and Evasive defender.",
      load: () =>
        loadAndValidateFixture("set14-audit-lexington-defender-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditLexingtonDefenderPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-shadow-player-two",
      name: "Hyperia audit: set14-audit-shadow-player-two",
      description: "Shadow opposing exert and Evasive boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-shadow-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditShadowPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-shadow-empty-player-two",
      name: "Hyperia audit: set14-audit-shadow-empty-player-two",
      description: "Shadow opposing exert and Evasive boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-shadow-empty-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditShadowEmptyPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-shadow-defender-player-two",
      name: "Hyperia audit: set14-audit-shadow-defender-player-two",
      description: "Shadow opposing exert and Evasive boundaries.",
      load: () =>
        loadAndValidateFixture("set14-audit-shadow-defender-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditShadowDefenderPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-dante-trash-player-two",
      name: "Hyperia audit: set14-audit-dante-trash-player-two",
      description: "Dante own discard threshold and Evasive.",
      load: () =>
        loadAndValidateFixture("set14-audit-dante-trash-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditDanteTrashPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-dante-trash-defender-player-two",
      name: "Hyperia audit: set14-audit-dante-trash-defender-player-two",
      description: "Dante own discard threshold and Evasive.",
      load: () =>
        loadAndValidateFixture("set14-audit-dante-trash-defender-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditDanteTrashDefenderPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-fox-rush-player-two",
      name: "Hyperia audit: Fox Player Two Rush",
      description: "Fox Player Two Rush boundaries and expiry.",
      load: () =>
        loadAndValidateFixture("set14-audit-fox-rush-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditFoxRushPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-brooklyn-ready-player-two",
      name: "Hyperia audit: Brooklyn Player Two ready",
      description: "Brooklyn printed abilities.",
      load: () =>
        loadAndValidateFixture("set14-audit-brooklyn-ready-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditBrooklynReadyPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-brooklyn-effect-player-two",
      name: "Hyperia audit: Brooklyn Player Two effect",
      description: "Brooklyn printed abilities.",
      load: () =>
        loadAndValidateFixture("set14-audit-brooklyn-effect-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditBrooklynEffectPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-brooklyn-fresh-player-two",
      name: "Hyperia audit: Brooklyn Player Two fresh",
      description: "Brooklyn printed abilities.",
      load: () =>
        loadAndValidateFixture("set14-audit-brooklyn-fresh-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditBrooklynFreshPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-merlin-tinkerer-normal-player-two",
      name: "Hyperia audit: Merlin Tinkerer Player Two normal",
      description: "Merlin Tinkerer printed abilities.",
      load: () =>
        loadAndValidateFixture("set14-audit-merlin-tinkerer-normal-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditMerlinTinkererNormalPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-merlin-tinkerer-shift-player-two",
      name: "Hyperia audit: Merlin Tinkerer Player Two shift",
      description: "Merlin Tinkerer printed abilities.",
      load: () =>
        loadAndValidateFixture("set14-audit-merlin-tinkerer-shift-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditMerlinTinkererShiftPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-merlin-tinkerer-exerted-player-two",
      name: "Hyperia audit: Merlin Tinkerer Player Two exerted",
      description: "Merlin Tinkerer printed abilities.",
      load: () =>
        loadAndValidateFixture("set14-audit-merlin-tinkerer-exerted-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditMerlinTinkererExertedPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-merlin-curious-entry-player-two",
      name: "Hyperia audit: Curious Merlin Player Two entry",
      description: "Merlin printed abilities.",
      load: () =>
        loadAndValidateFixture("set14-audit-merlin-curious-entry-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditMerlinCuriousEntryPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-merlin-curious-negative-player-two",
      name: "Hyperia audit: Curious Merlin Player Two negative",
      description: "Merlin printed abilities.",
      load: () =>
        loadAndValidateFixture("set14-audit-merlin-curious-negative-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditMerlinCuriousNegativePlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-merlin-curious-empty-player-two",
      name: "Hyperia audit: Curious Merlin Player Two empty",
      description: "Merlin printed abilities.",
      load: () =>
        loadAndValidateFixture("set14-audit-merlin-curious-empty-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditMerlinCuriousEmptyPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-owl-rush-player-two",
      name: "Hyperia audit: Owl Player Two rush",
      description: "Owl printed abilities.",
      load: () =>
        loadAndValidateFixture("set14-audit-owl-rush-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditOwlRushPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-owl-defender-player-two",
      name: "Hyperia audit: Owl Player Two defender",
      description: "Owl printed abilities.",
      load: () =>
        loadAndValidateFixture("set14-audit-owl-defender-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditOwlDefenderPlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-owl-negative-player-two",
      name: "Hyperia audit: Owl Player Two negative",
      description: "Owl printed abilities.",
      load: () =>
        loadAndValidateFixture("set14-audit-owl-negative-player-two", () =>
          import("./set14-audit-regressions.js").then(
            (m) => m.set14AuditOwlNegativePlayerTwoFixture,
          ),
        ),
    },
    {
      id: "set14-audit-mim-entry-player-two",
      name: "Hyperia audit: Mim Player Two entry",
      description: "Mim printed abilities.",
      load: () =>
        loadAndValidateFixture("set14-audit-mim-entry-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMimEntryPlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-mim-once-player-two",
      name: "Hyperia audit: Mim Player Two once",
      description: "Mim printed abilities.",
      load: () =>
        loadAndValidateFixture("set14-audit-mim-once-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMimOncePlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-remember-me",
      name: "Hyperia audit: Remember Me discard permission",
      description: "Paid exerted entry and global same-name restriction.",
      load: () =>
        loadAndValidateFixture("set14-audit-remember-me", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditRememberMeFixture),
        ),
    },
    {
      id: "set14-audit-mickey-return-song",
      name: "Hyperia audit: Mickey and return song",
      description: "Required quest, each-player drop and optional filtered return.",
      load: () =>
        loadAndValidateFixture("set14-audit-mickey-return-song", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditMickeyReturnSongFixture),
        ),
    },
    {
      id: "set14-audit-russell",
      name: "Hyperia audit: Russell mandatory reveal",
      description: "Public reveal and mandatory character-to-hand choice.",
      load: () =>
        loadAndValidateFixture("set14-audit-russell", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditRussellFixture),
        ),
    },
    {
      id: "set14-audit-powerline",
      name: "Hyperia audit: Powerline discard Singer",
      description: "Focused printed-text and target-legality regression.",
      load: () =>
        loadAndValidateFixture("set14-audit-powerline", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditPowerlineFixture),
        ),
    },
    {
      id: "set14-audit-early-amber",
      name: "Hyperia audit: Priya, Judy and Miguel",
      description: "Strength reduction, chosen healing amount and song-triggered lore.",
      load: () =>
        loadAndValidateFixture("set14-audit-early-amber", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditEarlyAmberFixture),
        ),
    },
    {
      id: "set14-audit-baymax",
      name: "Hyperia audit: Baymax's optional Supercharge",
      description: "Choose whether to replace each incoming drop with exerted ink.",
      load: () =>
        loadAndValidateFixture("set14-audit-baymax", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditBaymaxFixture),
        ),
    },
    {
      id: "set14-audit-louie-player-two",
      name: "Hyperia audit: King Louie Support player-two",
      description: "Support filters, current/last-known Strength, independent grants and expiry.",
      load: () =>
        loadAndValidateFixture("set14-audit-louie-player-two", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditLouiePlayerTwoFixture),
        ),
    },
    {
      id: "set14-audit-louie-banished",
      name: "Hyperia audit: King Louie Support banished",
      description: "Support filters, current/last-known Strength, independent grants and expiry.",
      load: () =>
        loadAndValidateFixture("set14-audit-louie-banished", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditLouieBanishedFixture),
        ),
    },
    {
      id: "set14-audit-louie-returned",
      name: "Hyperia audit: King Louie Support returned",
      description: "Support filters, current/last-known Strength, independent grants and expiry.",
      load: () =>
        loadAndValidateFixture("set14-audit-louie-returned", () =>
          import("./set14-audit-regressions.js").then((m) => m.set14AuditLouieReturnedFixture),
        ),
    },
    {
      id: "set14-audit-support-alert",
      name: "Hyperia audit: support-alert",
      description: "Focused Hyperia card audit with playable decks and prerequisites.",
      load: () =>
        loadAndValidateFixture("set14-audit-support-alert", () =>
          import("./set14-audit-regressions.js").then(
            (module) => module.set14AuditSupportAlertFixture,
          ),
        ),
    },
    {
      id: "set14-card-gallery",
      name: "Set 14 Card Gallery",
      description: "All Set 14 (Hyperia City) cards rendered face up in one browser fixture.",
      load: () =>
        loadAndValidateFixture("set14-card-gallery", () =>
          import("./set14-card-gallery.js").then((module) => module.set14CardGalleryFixture),
        ),
    },
    {
      id: "set14-vanilla-board",
      name: "Set 14 - Vanilla characters board",
      description:
        "All vanilla (no printed ability) Hyperia City characters in play, ready — validate stats/quest/challenge/damage without ability interference.",
      load: () =>
        loadAndValidateFixture("set14-vanilla-board", () =>
          import("./set14-manual-validation.js").then((module) => module.set14VanillaBoardFixture),
        ),
    },
    {
      id: "set14-amber-play",
      name: "Set 14 - Amber play tests",
      description: "Amber remainder cards in hand with 30 ink + 2 ink drops.",
      load: () =>
        loadAndValidateFixture("set14-amber-play", () =>
          import("./set14-manual-validation.js").then((module) => module.set14AmberPlayFixture),
        ),
    },
    {
      id: "set14-amethyst-play",
      name: "Set 14 - Amethyst play tests",
      description: "Amethyst remainder cards in hand with 30 ink + 2 ink drops.",
      load: () =>
        loadAndValidateFixture("set14-amethyst-play", () =>
          import("./set14-manual-validation.js").then((module) => module.set14AmethystPlayFixture),
        ),
    },
    {
      id: "set14-emerald-play",
      name: "Set 14 - Emerald play tests",
      description: "Emerald remainder cards in hand with 30 ink + 2 ink drops.",
      load: () =>
        loadAndValidateFixture("set14-emerald-play", () =>
          import("./set14-manual-validation.js").then((module) => module.set14EmeraldPlayFixture),
        ),
    },
    {
      id: "set14-ruby-play",
      name: "Set 14 - Ruby play tests",
      description: "Ruby remainder cards in hand with 30 ink + 2 ink drops.",
      load: () =>
        loadAndValidateFixture("set14-ruby-play", () =>
          import("./set14-manual-validation.js").then((module) => module.set14RubyPlayFixture),
        ),
    },
    {
      id: "set14-sapphire-play",
      name: "Set 14 - Sapphire play tests",
      description: "Sapphire remainder cards in hand with 30 ink + 2 ink drops.",
      load: () =>
        loadAndValidateFixture("set14-sapphire-play", () =>
          import("./set14-manual-validation.js").then((module) => module.set14SapphirePlayFixture),
        ),
    },
    {
      id: "set14-steel-play",
      name: "Set 14 - Steel play tests",
      description: "Steel remainder cards in hand with 30 ink + 2 ink drops.",
      load: () =>
        loadAndValidateFixture("set14-steel-play", () =>
          import("./set14-manual-validation.js").then((module) => module.set14SteelPlayFixture),
        ),
    },
    {
      id: "set14-amber-board",
      name: "Set 14 - Amber board tests",
      description: "Amber remainder cards staged in play, ready.",
      load: () =>
        loadAndValidateFixture("set14-amber-board", () =>
          import("./set14-manual-validation.js").then((module) => module.set14AmberBoardFixture),
        ),
    },
    {
      id: "set14-amethyst-board",
      name: "Set 14 - Amethyst board tests",
      description: "Amethyst remainder cards staged in play, ready.",
      load: () =>
        loadAndValidateFixture("set14-amethyst-board", () =>
          import("./set14-manual-validation.js").then((module) => module.set14AmethystBoardFixture),
        ),
    },
    {
      id: "set14-emerald-board",
      name: "Set 14 - Emerald board tests",
      description: "Emerald remainder cards staged in play, ready.",
      load: () =>
        loadAndValidateFixture("set14-emerald-board", () =>
          import("./set14-manual-validation.js").then((module) => module.set14EmeraldBoardFixture),
        ),
    },
    {
      id: "set14-ruby-board",
      name: "Set 14 - Ruby board tests",
      description: "Ruby remainder cards staged in play, ready.",
      load: () =>
        loadAndValidateFixture("set14-ruby-board", () =>
          import("./set14-manual-validation.js").then((module) => module.set14RubyBoardFixture),
        ),
    },
    {
      id: "set14-sapphire-board",
      name: "Set 14 - Sapphire board tests",
      description: "Sapphire remainder cards staged in play, ready.",
      load: () =>
        loadAndValidateFixture("set14-sapphire-board", () =>
          import("./set14-manual-validation.js").then((module) => module.set14SapphireBoardFixture),
        ),
    },
    {
      id: "set14-steel-board",
      name: "Set 14 - Steel board tests",
      description: "Steel remainder cards staged in play, ready.",
      load: () =>
        loadAndValidateFixture("set14-steel-board", () =>
          import("./set14-manual-validation.js").then((module) => module.set14SteelBoardFixture),
        ),
    },
    {
      id: "set14-ink-drops",
      name: "Ink Drops — bank, hold, and spend",
      description:
        "Ink-drop families with 3 pre-banked drops: play Higitus Figitus to bank 3 more, then pay by removing drops (Wasabi - Future Thinker wants to be paid with one).",
      load: () =>
        loadAndValidateFixture("set14-ink-drops", () =>
          import("./set14-condition-scenarios.js").then((module) => module.set14InkDropsFixture),
        ),
    },
    {
      id: "set14-singers-songs",
      name: "Singers, songs, and song-in-discard triggers",
      description:
        "Singers on board with songs in hand/discard: sing, play, and exercise song-in-discard and played-a-song triggers.",
      load: () =>
        loadAndValidateFixture("set14-singers-songs", () =>
          import("./set14-condition-scenarios.js").then(
            (module) => module.set14SingersSongsFixture,
          ),
        ),
    },
    {
      id: "set14-discard-ten",
      name: "Discard-matters (14 cards pre-staged in discard)",
      description: "Discard-matters cards with 14 cards pre-staged in discard.",
      load: () =>
        loadAndValidateFixture("set14-discard-ten", () =>
          import("./set14-condition-scenarios.js").then((module) => module.set14DiscardTenFixture),
        ),
    },
    {
      id: "set14-items",
      name: "Item synergies (towers, chem balls, differing names)",
      description:
        "Item synergies: towers, chem balls, and differing-name item gates staged in play.",
      load: () =>
        loadAndValidateFixture("set14-items", () =>
          import("./set14-condition-scenarios.js").then((module) => module.set14ItemsFixture),
        ),
    },
    {
      id: "set14-gargoyle-hand",
      name: "Gargoyle hand-size (Stone by Day)",
      description: "Gargoyle hand-size (Stone by Day) staging with a full hand.",
      load: () =>
        loadAndValidateFixture("set14-gargoyle-hand", () =>
          import("./set14-condition-scenarios.js").then(
            (module) => module.set14GargoyleHandFixture,
          ),
        ),
    },
    {
      id: "set14-locations-movement",
      name: "Locations and free movement",
      description:
        "Locations staged with characters to exercise free movement and location triggers.",
      load: () =>
        loadAndValidateFixture("set14-locations-movement", () =>
          import("./set14-condition-scenarios.js").then(
            (module) => module.set14LocationsMovementFixture,
          ),
        ),
    },
    {
      id: "set14-damage-challenge",
      name: "Damage tables and challenge triggers",
      description: "Damage tables and challenge triggers staged with pre-set damage.",
      load: () =>
        loadAndValidateFixture("set14-damage-challenge", () =>
          import("./set14-condition-scenarios.js").then(
            (module) => module.set14DamageChallengeFixture,
          ),
        ),
    },
    {
      id: "set14-detective-court",
      name: "Detective pair, played-a-character gates, Tremaine's court",
      description: "Detective pair, played-a-character gates, and Tremaine's court staged.",
      load: () =>
        loadAndValidateFixture("set14-detective-court", () =>
          import("./set14-condition-scenarios.js").then(
            (module) => module.set14DetectiveCourtFixture,
          ),
        ),
    },
    {
      id: "set14-super-team",
      name: "Super team (Fred, Big Hero 6)",
      description: "Super team (Fred, Big Hero 6) synergy staging.",
      load: () =>
        loadAndValidateFixture("set14-super-team", () =>
          import("./set14-condition-scenarios.js").then((module) => module.set14SuperTeamFixture),
        ),
    },
    {
      id: "set14-shift-bases",
      name: "Shift bases — every shift pair staged",
      description: "Every shift pair staged with its base to validate shift costs.",
      load: () =>
        loadAndValidateFixture("set14-shift-bases", () =>
          import("./set14-condition-scenarios.js").then((module) => module.set14ShiftBasesFixture),
        ),
    },
    {
      id: "set14-ink-drop-render",
      name: "Ink Drops — counter rendering (overflow + both seats)",
      description:
        "Ink-drop token strip staging: 8 drops on player one (+N overflow) and 2 on player two (opponent inkwell).",
      load: () =>
        loadAndValidateFixture("set14-ink-drop-render", () =>
          import("./set14-condition-scenarios.js").then(
            (module) => module.set14InkDropRenderFixture,
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
    {
      id: "adventurous-keyword",
      name: "Adventurous Keyword Badge",
      description:
        "Visual validation for the set 14 Adventurous badge. Mickey Mouse - Best in Town is printed with Adventurous (can't challenge and must quest if able): the board tag should read Adventurous with the full keyword tooltip instead of the generic Can't Challenge badge. Goofy Musketeer is the unbadged contrast.",
      load: () =>
        loadAndValidateFixture("adventurous-keyword", () =>
          import("./adventurous-keyword.js").then((module) => module.adventurousKeywordFixture),
        ),
    },
    {
      id: "triage-2026-10-02-cinderella-unintentional-icon",
      name: "Triage 2026-10-02 Cinderella - Unintentional Icon",
      description:
        "Player report: BESPOKE DESIGN felt like it never fired. Shift Cinderella - Unintentional Icon onto Cinderella - Homespun Dressmaker, pass the turn, and the end-of-turn prompt should offer to look at the top 2 cards (accept arranges one into the inkwell facedown and exerted).",
      load: () =>
        loadAndValidateFixture("triage-2026-10-02-cinderella-unintentional-icon", () =>
          import("./regressions/2026-10-02/cinderella-unintentional-icon.js").then(
            (module) => module.triageCinderellaUnintentionalIconFixture,
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
