import {
  createGameEndFixture,
  createSharedNonClashPreventionFixture,
  createAmbushFixture,
  createCombatBuffFixture,
  createCombatCounterFixture,
  createCombatTargetFixture,
  createObstructionFixture,
} from "./combat-fixture";
import { createBoardActionFixture } from "./board-action-fixture";
import { nativeFixtureState } from "./native-fixture-state";
import { optionalEffectFixtures, createOptionalEffectFixture } from "./optional-effect-fixtures";
import { destinationFixtures, createDestinationFixture } from "./destination-fixtures";
import { createSimultaneousOrderFixture } from "./simultaneous-order-fixture";
import { createSearchRetrieveFixture } from "./search-retrieve-fixture";
import { createResourcePaymentFixture } from "./resource-payment-fixture";
import { alphaClashPromptFixtures, isAlphaClashPromptFixture } from "./prompt-fixture-catalog";
import { createAlphaClashPromptFixture } from "./prompt-fixtures";
import { createClashPlayFixture } from "./clash-play-fixture";
import { createResourceStepFixture } from "./resource-step-fixture";
import { getCard } from "@tcg/alpha-clash-cards";
import { createInitialState } from "@tcg/alpha-clash-engine";
import { AcTestEngine, HUNTERS_DECK, STORM_DECK } from "@tcg/alpha-clash-engine/testing";
import { AlphaClashServerEngine } from "@tcg/alpha-clash-server-adapter";

export const alphaClashVisualFixtures = [
  {
    id: "inspection-arrangement",
    title: "Arena · Hand and pile inspection",
    description:
      "Arrange a crowded hand and inspect ordered public piles without submitting a game action.",
  },
  {
    id: "combat-obstruct-forced",
    title: "Combat · Required obstructor",
    description:
      "Attack with War, Controlling Minds and select opposing Sonoro for its native attack trigger. Pass responses, then choose Do not obstruct: native resolution still adds the required ready Sonoro. Reset to explicitly add LINN alongside the required card.",
  },
  {
    id: "combat-obstruct-forced-unable",
    title: "Combat · Required obstructor is engaged",
    description:
      "War selects the opposing engaged Sonoro through its native attack trigger. Pass responses and choose Do not obstruct; the engaged card cannot be added. Compare this with the ready required-obstructor variant.",
  },
  {
    id: "combat-prevention-non-clash",
    title: "Combat · Shared non-clash prevention",
    description:
      "Open Portal and play Sonoro. Respond with Soul Barrier and send one defending Sonoro to Oblivion. Pass responses. Attack with Plasmax, then respond with Erupting Force. Allocate the one shared prevention point between two defending Sonoros; the unprotected Sonoro is defeated. No barrier is seeded.",
  },
  {
    id: "combat-prevention-local",
    title: "Combat · Local prevention allocation",
    description:
      "Attack with Sonoro. Respond with Earthly Barricade on Magnate, then Rooftop Roll on attacking Sonoro. Pass responses and declare Magnate plus Plasmax as obstructors. Pass to damage, then split the three-point local barrier between sources. Reset to test a concentrated allocation and invalid totals.",
  },
  {
    id: "ambush-set-response",
    title: "Ambush · Set, wait, respond",
    description:
      "Open Portal and Set Gur. End turn, skip the other seat’s resource step, and play Sonoro. Respond with Gur from the Accessory Zone. Reset to verify Gur cannot respond on its set turn. Weaponry Morphing also exposes native Set; its Synthoria target path is a separate authored-data gap.",
  },
  {
    id: "finish-lethal",
    title: "Game end · Lethal clash",
    description:
      "Attack the opposing Contender with Sonoro. Pass counters, skip obstruction, and pass both buff and before-damage priorities. Native damage ends the match from one health.",
  },
  {
    id: "finish-deckout",
    title: "Game end · Failed draw",
    description:
      "The opposing deck is empty, with its complete card ledger in Oblivion. End your turn; the native draw step produces the loss. No terminal state is injected.",
  },
  {
    id: "combat-obstruct-flight",
    title: "Combat · Flight and Interception",
    description:
      "Attack with Plasmax and pass counters. Only LINN with Interception and opposing Plasmax with Flight may obstruct; Sonoro cannot. Reset for skip, one and both legal obstructors.",
  },
  {
    id: "combat-obstruct-torment",
    title: "Combat · Torment minimum",
    description:
      "Iron Piston starts with native Magnitude 15. Attack, resolve its native diminish trigger and any pile ordering, then pass counters. Choose at least two obstructors or choose Do not obstruct.",
  },
  {
    id: "combat-target-legality",
    title: "Combat · Attacker-specific legal targets",
    description:
      "Choose Sonoro: ready opposing Sonoro is unavailable, engaged Magnate and the Contender are legal. Cancel, choose LINN with Close Combat: ready Sonoro is now legal. Reset to attack with your Contender. All target sets come from native checks.",
  },
  {
    id: "combat-counter-targets",
    title: "Combat · Nested Counter targets",
    description:
      "Attack with Sonoro. Player 2 responds with Earthly Barricade targeting Magnate; Player 1 responds with Rooftop Roll targeting Sonoro. Pass both windows and complete the clash. Reset to verify Missile Barrage can be Set before any attack.",
  },
  {
    id: "combat-prevention",
    title: "Combat · Prevent damage from multiple sources",
    description:
      "Attack with Sonoro; respond with Archaic Shield, complete Foretell and send the revealed Magnate to Oblivion. Declare both obstructors and allocate the shared prevention before damage.",
  },
  {
    id: "combat-buffs",
    title: "Combat · Both buff windows",
    description:
      "Attack with Sonoro; pass counters; choose obstruction or skip. Each green Contender can play Shattering Blow during its own buff step. Finish damage through native passes.",
  },
  {
    id: "combat-buffs-victory",
    title: "Combat · Buff Victory follow-up",
    description:
      "Set Archaic Shield from Player 1's hand. Attack with Sonoro; pass counters; obstruct with Player 2's Sonoro. Buff the attacker with Shattering Blow, skip defender buff, and finish damage. The granted Victory trigger can send the newly set own accessory to Oblivion; resolve through its native choice.",
  },
  {
    id: "board-actions",
    title: "Board actions · Portal, Weapons and Oblivion",
    description:
      "Reset between paths: activate the Portal; set Archaic Shield; attach Heavy Metal or Death Blades; play Dread Titan from Oblivion; activate Rizlac from Oblivion; play a Clashground for Player 2’s T-Bone response.",
  },
  {
    id: "portal-reduced",
    title: "Board actions · Portal cost reduction",
    description:
      "Low Earth Orbit is already in play. Use the board Portal control to open, then close. Each native activation pays one resource; repeat until the remaining ready resources are insufficient. Reset restores the pre-action board.",
  },
  {
    id: "portal-increased",
    title: "Board actions · Opposing Portal cost increase",
    description:
      "The opponent has Undiscovered Passageway in play. Open and close through the board Portal control; native activation costs three resources. Its entry and next-turn triggers are separate paths, not seeded choices.",
  },
  {
    id: "simultaneous-both-owners",
    title: "Alpha Aster · Both owners order arrivals",
    description:
      "Play Alpha Aster, pass responses, then arrange Player 1’s arrivals followed by Player 2’s. The other seat must wait.",
  },
  ...alphaClashPromptFixtures,
  ...optionalEffectFixtures,
  ...destinationFixtures,
  {
    id: "simultaneous-effects",
    title: "Arena · Simultaneous effects",
    description:
      "End your turn. Three real Master Zephyrion cards trigger at the start of the opposing turn. Arrange their effect markers, then submit the complete resolution order.",
  },
  {
    id: "simultaneous-oblivion",
    title: "Arena · Simultaneous Oblivion arrivals",
    description:
      "Play Alpha Aster and pass responses. It sends three real Clash cards to Oblivion. Arrange the arrivals top first, keeping the older pile in place.",
  },
  {
    id: "search-deck",
    title: "Morac · Search the deck",
    description:
      "Play Morac, pass responses, and accept its search. Search a 36-card deck: 18 legal Discarded Clash copies in 7 stacks (×3 Lord Krung, ×3 Gur, …); other cards stay hidden. Identical cards share one tile with a count; placing flies the reveal from deck to hand. Find no card skips.",
  },
  {
    id: "search-single",
    title: "Morac · One search result",
    description:
      "Play Morac, pass responses, and accept its search. Gur is the only eligible card. Choose it or find no card; verify the native shuffle and hand destination.",
  },
  {
    id: "search-empty",
    title: "Morac · No search results",
    description:
      "Play Morac and pass responses. Accept the native search over a complete deck ledger with no matching candidates. The engine shuffles and continues.",
  },
  {
    id: "retrieve-oblivion",
    title: "Weapon’s Depot · Retrieve a Weapon",
    description:
      "Play Weapon’s Depot, pass responses, and accept retrieval. Your public Oblivion holds Heavy Metal ×2 among other cards. Pick a stack tile, then place it in your Accessory Zone and watch the flight.",
  },
  {
    id: "retrieve-single",
    title: "Weapon’s Depot · One retrieval result",
    description:
      "Play Weapon’s Depot, pass responses, and accept retrieval. Heavy Metal is the only eligible Weapon; choose it and place it in the Accessory Zone.",
  },
  {
    id: "retrieve-empty",
    title: "Weapon’s Depot · Empty retrieval",
    description:
      "Play Weapon’s Depot and pass responses. Accept the native trigger with no eligible Weapon. No card moves.",
  },
  {
    id: "resource-payment",
    title: "Arena · Resource payment",
    description:
      "Assign distinct ready resources and colors to native cost slots. Cancel, retry, then pay and inspect engagement. Conquest [6] in hand is unaffordable: disabled action, silent drop.",
  },
  {
    id: "counter-types",
    title: "Counters · Six native creation paths",
    description:
      "Reset between paths: play Mean-Streak for Streak; Infectious Presence for Toxic; Mark of the Hunted for Bounty; Accumulation targeting Ancient Scarab for Collection; activate Portal for Scarab; attach Heavy Metal to Gearwin and accept Temper. No counters are seeded.",
  },
  {
    id: "arena-drop-targets",
    title: "Arena · Drop targets",
    description:
      "Drag a Clash card, Accessory, or Clashground from hand. Only its legal zone lights up, with a short explanation. Continue through native payment or cancel.",
  },
  {
    id: "clash-play",
    title: "Arena · Play a Clash card",
    description:
      "Drag Sonoro or Magnate to your Clash Zone. Pay through the native engine, pass the response window, then check the ready card. Conquest is too expensive; the Weapon is not a Clash card.",
  },
  {
    id: "resource-step",
    title: "Arena · Resource step",
    description:
      "Drag a hand card to your Resource Zone, or choose Skip resource. Native rules validate Rivaled and Bound restrictions.",
  },
  {
    id: "opening-preview",
    title: "Opening · Real game setup",
    description:
      "Seeded, validated 50-card decks. Inspect both opening hands, use the engine’s selected-card mulligan, then start turn one and deploy a resource. Player 1 starts.",
  },
  {
    id: "arena-trap-counter",
    title: "Arena · Trap target",
    description:
      "Attack with Sonoro, then activate an older set Archaic Shield against the attacking Sonoro. The engine validates the target and resolves the Trap.",
  },
  {
    id: "arena",
    title: "Arena · Primary phase",
    description:
      "Official card art, both playmats, resources, accessories and card inspection. Use Actions to play through the engine.",
  },
  {
    id: "arena-crowded",
    title: "Arena · Crowded board",
    description:
      "Eight Clash cards, a large hand, spent resources and Oblivion. Check scrolling, inspection and landscape phone layout.",
  },
  {
    id: "arena-clash",
    title: "Arena · Start a clash",
    description:
      "Initiate a clash with Sonoro against the opposing Contender. Control both seats through counters, obstruction, buffs, and damage.",
  },
] as const;

/** Keep the former inspection route without duplicating its crowded-board factory. */
export function canonicalAlphaClashFixtureId(id: string) {
  return id === "inspection-arrangement" ? "arena-crowded" : id;
}

export function createAlphaClashVisualFixture(id: string): AlphaClashServerEngine {
  id = canonicalAlphaClashFixtureId(id);
  if (!alphaClashVisualFixtures.some((fixture) => fixture.id === id))
    throw new Error(`Unknown Alpha Clash fixture: ${id}`);
  if (id === "ambush-set-response") return createAmbushFixture();
  if (id === "finish-lethal") return createGameEndFixture("lethal");
  if (id === "finish-deckout") return createGameEndFixture("deckout");
  if (id === "combat-obstruct-forced") return createObstructionFixture("forced");
  if (id === "combat-obstruct-forced-unable") return createObstructionFixture("forced-unable");
  if (id === "combat-obstruct-flight") return createObstructionFixture("flight");
  if (id === "combat-obstruct-torment") return createObstructionFixture("torment");
  if (id === "combat-target-legality") return createCombatTargetFixture();
  if (id === "combat-prevention-non-clash") return createSharedNonClashPreventionFixture();
  if (id === "combat-prevention-local") return createCombatCounterFixture("local-prevention");
  if (id === "combat-counter-targets") return createCombatCounterFixture();
  if (id === "combat-buffs") return createCombatBuffFixture();
  if (id === "combat-buffs-victory") return createCombatBuffFixture("victory");
  if (id === "combat-prevention") return createDestinationFixture(id);
  if (id === "board-actions") return createBoardActionFixture();
  if (id === "portal-reduced" || id === "portal-increased") return createBoardActionFixture(id);
  if (id === "simultaneous-both-owners") return createSimultaneousOrderFixture("oblivion", true);
  if (optionalEffectFixtures.some((fixture) => fixture.id === id))
    return createOptionalEffectFixture(id);
  if (destinationFixtures.some((f) => f.id === id)) return createDestinationFixture(id);
  if (
    [
      "search-deck",
      "search-single",
      "search-empty",
      "retrieve-oblivion",
      "retrieve-single",
      "retrieve-empty",
    ].includes(id)
  )
    return createSearchRetrieveFixture(id);
  if (id === "simultaneous-effects") return createSimultaneousOrderFixture("effects");
  if (id === "simultaneous-oblivion") return createSimultaneousOrderFixture("oblivion");
  if (isAlphaClashPromptFixture(id)) return createAlphaClashPromptFixture(id);
  if (id === "resource-payment") return createResourcePaymentFixture();
  if (id === "clash-play") return createClashPlayFixture();
  if (id === "resource-step") return createResourceStepFixture();
  if (id === "arena-drop-targets") {
    const sonoro = getCard("ac-ac1-027");
    const game = nativeFixtureState({
      id,
      turnNumber: 13,
      playerOne: {
        contender: getCard("ac-st-001"),
        deck: 30,
        hand: [sonoro, getCard("ac-ac1-016"), getCard("ac-ac1-097")],
        clash: [sonoro],
        // Each showcased play can pay its native colored cost. Binoculars is a
        // fully authored Accessory; the previous Armor has unparsed abilities.
        resource: [
          sonoro,
          sonoro,
          getCard("ac-ac1-007"),
          getCard("ac-ac1-007"),
          getCard("ac-ac1-097"),
          getCard("ac-ac1-097"),
        ],
      },
      playerTwo: {
        contender: getCard("ac-ac1-096"),
        deck: 30,
        hand: [sonoro, sonoro, sonoro, getCard("ac-ac1-028")],
        clash: [sonoro, getCard("ac-ac1-028")],
        resource: [sonoro, sonoro, sonoro],
      },
    });
    return new AlphaClashServerEngine(game.state, { human: "player-one", bot: "player-two" });
  }
  if (id === "counter-types") {
    // Each counter is produced by an official card's native command/trigger.
    // Reset between paths; there are no preloaded visual-only counters.
    const game = nativeFixtureState({
      id: "visual-counter-types",
      turnNumber: 41,
      playerOne: {
        contender: getCard("ac-ac1-071"),
        hand: ["ac-ac1-077", "ac-ac2-038", "ac-ac3-106", "ac-ac2-094"].map(getCard),
        clash: [getCard("ac-ac7-150"), getCard("ac-ac1-027")],
        accessory: [getCard("ac-st2-010"), getCard("ac-ac7-128")],
        resource: [
          ...Array.from({ length: 6 }, () => getCard("ac-ac3-106")),
          ...Array.from({ length: 6 }, () => getCard("ac-ac2-038")),
          ...Array.from({ length: 4 }, () => getCard("ac-ac7-162")),
        ],
      },
      playerTwo: {
        contender: getCard("ac-ac1-096"),
        clash: [getCard("ac-ac1-027")],
        hand: [getCard("ac-ac1-028")],
      },
    });
    return new AlphaClashServerEngine(game.state, { human: "player-one", bot: "player-two" });
  }
  if (id === "opening-preview") {
    // Keep setup intact: the native initializer shuffles and deals both hands.
    // Do not use fromFixture's default post-setup state or inject fixed hands.
    const game = AcTestEngine.fromState(
      createInitialState({
        id: "visual-opening-preview",
        seed: 11,
        firstPlayer: "player-one",
        players: {
          "player-one": {
            name: "Player 1",
            deck: { contenderId: "ac-st-001", deckIds: HUNTERS_DECK.map((card) => card.id) },
          },
          "player-two": {
            name: "Player 2",
            deck: { contenderId: "ac-ac1-096", deckIds: STORM_DECK.map((card) => card.id) },
          },
        },
      }),
    );
    return new AlphaClashServerEngine(game.state, { human: "player-one", bot: "player-two" });
  }
  if (id === "arena-trap-counter") {
    const attacker = getCard("ac-ac1-027");
    const trap = getCard("ac-ac1-020");
    const game = nativeFixtureState({
      id: "visual-arena-trap-counter",
      turnNumber: 7,
      playerOne: { contender: getCard("ac-st-001"), clash: [attacker, getCard("ac-ac1-032")] },
      playerTwo: {
        contender: getCard("ac-ac1-096"),
        hand: [trap],
        accessory: [{ card: trap, faceDown: true, setOnTurn: 1 }],
        resource: [trap, trap, trap],
      },
    });
    return new AlphaClashServerEngine(game.state, { human: "player-one", bot: "player-two" });
  }
  const crowded = id === "arena-crowded";
  const sonoro = getCard("ac-ac1-027");
  const magnate = getCard("ac-st-001");
  const torque = getCard("ac-ac1-096");
  const allies = [
    "ac-ac1-028",
    "ac-ac1-029",
    "ac-ac1-030",
    "ac-ac1-031",
    "ac-ac1-032",
    "ac-ac1-033",
    "ac-ac1-034",
  ].map(getCard);
  const game = nativeFixtureState({
    id: `visual-${id}`,
    seed: 7,
    // Leave enough turns for six ordinary resource placements. Full zone
    // history remains a separate fixture acceptance check.
    turnNumber: 13,
    playerOne: {
      contender: magnate,
      health: 26,
      deck: crowded ? 25 : 30,
      hand: crowded
        ? [sonoro, ...allies, sonoro, ...allies.slice(0, 3)]
        : [sonoro, ...allies.slice(0, 4)],
      clash: crowded ? [sonoro, ...allies] : [sonoro, { card: allies[0], ready: false }, allies[1]],
      resource: [
        sonoro,
        sonoro,
        sonoro,
        sonoro,
        { card: sonoro, ready: false },
        { card: sonoro, ready: false },
      ],
      accessory: [{ card: getCard("ac-ac5-109"), faceDown: true }],
      clashground: [getCard("ac-ac1-097")],
      oblivion: crowded ? allies : [allies[3]],
    },
    playerTwo: {
      contender: torque,
      health: 23,
      deck: 29,
      hand: allies.slice(0, 4),
      clash: [{ card: allies[4], ready: false }, allies[5]],
      resource: 5,
      accessory: [{ card: getCard("ac-ac5-109"), faceDown: true }],
      clashground: [getCard("ac-ac1-097")],
      oblivion: [allies[6]],
    },
  });
  return new AlphaClashServerEngine(game.state, { human: "player-one", bot: "player-two" });
}
