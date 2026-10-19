import { nativeFixtureState } from "./native-fixture-state";
import { createCostRouteFixture } from "./cost-route-fixture";
import { costRouteFixtures } from "./cost-route-fixture-catalog";
import { getCard } from "@tcg/alpha-clash-cards";
import { AlphaClashServerEngine } from "@tcg/alpha-clash-server-adapter";
import { isAlphaClashPromptFixture } from "./prompt-fixture-catalog";

/** Arrange once with the native test harness; all subsequent moves use the production adapter. */
export function createAlphaClashPromptFixture(id: string): AlphaClashServerEngine {
  if (!isAlphaClashPromptFixture(id)) throw new Error(`Unknown prompt fixture: ${id}`);
  if (costRouteFixtures.some((f) => f.id === id)) return createCostRouteFixture(id);
  if (id === "prompt-x-payment") {
    const game = nativeFixtureState({
      id: `native-${id}`,
      turnNumber: 13,
      playerOne: {
        hand: [getCard("acx-hydra-strike")],
        resource: [getCard("ac-ac1-027"), getCard("ac-ac1-027"), getCard("ac-ac1-027")],
      },
      playerTwo: { clash: [getCard("acx-tormentor"), getCard("acx-tormentor")] },
    });
    return new AlphaClashServerEngine(game.state, { human: "player-one", bot: "player-two" });
  }
  if (id === "prompt-sacrifice-payment") {
    const trap = getCard("ac-ac7-028");
    const ally = getCard("ac-ac6-169");
    const attacker = getCard("ac-ac4-154");
    const game = nativeFixtureState({
      id: `native-${id}`,
      turnNumber: 13,
      activePlayer: "player-two",
      portalOpen: true,
      playerOne: {
        health: 15,
        clash: [ally, ally],
        accessory: [{ card: trap, faceDown: true, setOnTurn: 1 }],
        resource: [trap, trap, trap, trap],
      },
      playerTwo: { clash: [attacker] },
    });
    game.playerTwo.attack(attacker, game.playerOne.contender());
    return new AlphaClashServerEngine(game.state, { human: "player-one", bot: "player-two" });
  }
  if (id === "prompt-optional-discounts") {
    const response = getCard("ac-ac5-118");
    const incoming = getCard("ac-ac6-114");
    const game = nativeFixtureState({
      id: `native-${id}`,
      turnNumber: 13,
      activePlayer: "player-two",
      playerOne: {
        hand: [response],
        resource: [response, response, response, response],
        clash: [getCard("ac-ac2-121"), getCard("ac-ac3-092")],
      },
      playerTwo: { hand: [incoming], resource: [response, response] },
    });
    game.playerTwo.play(incoming);
    return new AlphaClashServerEngine(game.state, { human: "player-one", bot: "player-two" });
  }
  if (id === "prompt-trigger-targets") {
    const linn = getCard("ac-ac3-092");
    const game = nativeFixtureState({
      id: `native-${id}`,
      turnNumber: 13,
      playerOne: { hand: [linn], resource: [linn, linn, linn] },
      playerTwo: { clash: [getCard("ac-ac1-055"), getCard("ac-ac3-007")] },
    });
    return new AlphaClashServerEngine(game.state, { human: "player-one", bot: "player-two" });
  }
  if (id === "prompt-declared-modes" || id === "prompt-manifest") {
    const manifest = id === "prompt-manifest";
    const spell = getCard(manifest ? "ac-ac8-181" : "ac-ac2-115");
    const game = nativeFixtureState({
      id: `native-${id}`,
      turnNumber: 13,
      portalOpen: true,
      playerOne: {
        ...(manifest ? { contender: getCard("ac-ac1-047") } : {}),
        hand: [spell],
        resource: manifest ? [] : [spell, spell, spell],
        oblivion: manifest
          ? [
              getCard("ac-ac1-027"),
              getCard("ac-ac1-028"),
              getCard("ac-ac1-016"),
              getCard("ac-ac2-115"),
            ]
          : [],
      },
      playerTwo: { accessory: manifest ? [] : [getCard("ac-ac1-016")] },
    });
    return new AlphaClashServerEngine(game.state, { human: "player-one", bot: "player-two" });
  }
  if (id === "prompt-oblivion-return") {
    const sonoro = getCard("ac-ac1-027");
    const game = nativeFixtureState({
      id: "native-prompt-oblivion-return",
      turnNumber: 13,
      portalOpen: true,
      playerOne: {
        contender: getCard("ac-vtd1-001-p-black"),
        health: 14,
        deck: [sonoro, getCard("ac-ac1-001"), sonoro, sonoro],
        oblivion: [sonoro, getCard("ac-ac1-028"), getCard("ac-ac6-033")],
      },
      playerTwo: {
        contender: getCard("ac-ac1-096"),
      },
    });
    return new AlphaClashServerEngine(game.state, { human: "player-one", bot: "player-two" });
  }
  if (id === "prompt-bombardment") {
    const bombardment = getCard("ac-ac6-033");
    const sonoro = getCard("ac-ac1-027");
    const deck = [sonoro, sonoro, sonoro, sonoro, sonoro, sonoro, sonoro, sonoro];
    const game = nativeFixtureState({
      id: "native-prompt-bombardment",
      turnNumber: 13,
      playerOne: {
        contender: getCard("ac-st-001"),
        hand: [bombardment],
        resource: [bombardment],
        deck,
      },
      playerTwo: {
        contender: getCard("ac-ac1-096"),
        clash: [sonoro],
        deck,
      },
    });
    return new AlphaClashServerEngine(game.state, { human: "player-one", bot: "player-two" });
  }
  if (id === "prompt-health-payment") {
    const attacker = getCard("ac-ac1-027");
    const payment = getCard("ac-ac5-032");
    const game = nativeFixtureState({
      id: "native-prompt-health-payment",
      turnNumber: 11,
      playerOne: {
        contender: getCard("ac-st-001"),
        clash: [attacker],
        hand: [attacker],
        deck: [attacker, attacker],
      },
      playerTwo: {
        contender: getCard("ac-ac1-096"),
        health: 8,
        hand: [payment],
        deck: [attacker, payment],
        resource: [payment, payment, payment, payment, payment],
      },
    });
    return new AlphaClashServerEngine(game.state, { human: "player-one", bot: "player-two" });
  }
  const sonoro = getCard("ac-ac1-027");
  const magnate = getCard("ac-ac1-028");
  const haven = getCard("ac-ac1-051");
  const denver = getCard("ac-ac1-001");
  const machina = getCard("ac-ac1-108");
  const caoLing = getCard("ac-ac3-063");
  const magnatePoweredUp = getCard("ac-ac7-059");
  const counters = id === "prompt-number" || id === "prompt-targets";
  const alternate = id === "prompt-alternate-cost";
  const deck = [sonoro, magnate, haven, denver, sonoro, haven, magnate, machina];
  const game = nativeFixtureState({
    id: `native-${id}`,
    seed: 17,
    turnNumber: id === "prompt-foretell-draw-step" ? 14 : 13,
    activePlayer: id === "prompt-foretell-draw-step" ? "player-two" : "player-one",
    playerOne: {
      contender: getCard(
        counters ? "ac-ac1-071" : id.startsWith("prompt-foretell") ? "ac-ac1-047" : "ac-st-001",
      ),
      health: id === "prompt-foretell" ? 10 : 26,
      deck,
      hand: counters
        ? [getCard("ac-ac1-077")]
        : alternate
          ? [caoLing, haven]
          : id === "prompt-target-change"
            ? [getCard("ac-ac3-102"), haven, denver]
            : [haven, denver],
      clash: alternate
        ? [magnatePoweredUp, magnate]
        : id === "prompt-barrage"
          ? [machina]
          : [sonoro, magnate],
      resource: [
        counters
          ? getCard("ac-ac1-077")
          : id === "prompt-target-change"
            ? getCard("ac-ac3-102")
            : haven,
        haven,
        denver,
        sonoro,
        magnate,
        machina,
      ],
    },
    playerTwo: {
      contender: getCard("ac-ac1-096"),
      health: 25,
      deck,
      hand: [haven, denver],
      clash: [sonoro, magnate],
      resource: [haven, sonoro, denver],
    },
  });
  return new AlphaClashServerEngine(game.state, { human: "player-one", bot: "player-two" });
}
