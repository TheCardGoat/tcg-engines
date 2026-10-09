import { createResourceStepFixture } from "./resource-step-fixture";
import { getCard } from "@tcg/alpha-clash-cards";
import { createInitialState } from "@tcg/alpha-clash-engine";
import { AcTestEngine, HUNTERS_DECK, STORM_DECK } from "@tcg/alpha-clash-engine/testing";
import { AlphaClashServerEngine } from "@tcg/alpha-clash-server-adapter";

export const alphaClashVisualFixtures = [
  {
    id: "resource-step",
    title: "Arena · Resource step",
    description:
      "Drag a hand card to your Resource Zone, or drag the step marker to Skip resource. Native rules validate Rivaled and Bound restrictions.",
  },
  {
    id: "opening-preview",
    title: "Opening · Real game setup",
    description:
      "Seeded, validated 50-card decks. Inspect both opening hands, use the engine's full-hand mulligan, then start turn one and deploy a resource. Player 1 starts.",
  },
  {
    id: "arena-trap-counter",
    title: "Arena · Trap target",
    description:
      "Activate an older set Missile Barrage against the attacking Sonoro. The engine validates the target and resolves the Trap.",
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
    title: "Arena · Clash in progress",
    description:
      "The TestEngine initiates a real clash. Resolve the defending player's response with Actions.",
  },
] as const;

export function createAlphaClashVisualFixture(id: string): AlphaClashServerEngine {
  if (!alphaClashVisualFixtures.some((fixture) => fixture.id === id))
    throw new Error(`Unknown Alpha Clash fixture: ${id}`);
  if (id === "resource-step") return createResourceStepFixture();
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
    const game = AcTestEngine.fromFixture({
      id: "visual-arena-trap-counter",
      turnNumber: 5,
      playerOne: { contender: getCard("ac-st-001"), clash: [attacker, getCard("ac-ac1-032")] },
      playerTwo: {
        contender: getCard("ac-ac1-096"),
        hand: [trap],
        accessory: [{ card: trap, faceDown: true, setOnTurn: 1 }],
        resource: [trap, trap, trap],
      },
    });
    game.playerOne.attack(attacker, game.playerTwo.contender());
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
  const game = AcTestEngine.fromFixture({
    id: `visual-${id}`,
    seed: 7,
    turnNumber: 5,
    playerOne: {
      contender: magnate,
      health: 26,
      deck: 30,
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
  if (id === "arena-clash") game.playerOne.attack(sonoro, torque);
  return new AlphaClashServerEngine(game.state, { human: "player-one", bot: "player-two" });
}
