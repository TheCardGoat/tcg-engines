import { HUNTERS_DECK } from "@tcg/alpha-clash-engine/testing";
import { getCard } from "@tcg/alpha-clash-cards";
import { AlphaClashServerEngine } from "@tcg/alpha-clash-server-adapter";
import { nativeFixtureState, officialFixtureCards } from "./native-fixture-state";

export function createCombatBuffFixture(variant: "both-windows" | "victory" = "both-windows") {
  const game = nativeFixtureState({
    id: variant === "victory" ? "combat-buffs-victory" : "combat-buffs",
    turnNumber: 5,
    playerOne: {
      contender: getCard("ac-st-001"),
      hand: [getCard("ac-ac3-033"), ...(variant === "victory" ? [getCard("ac-ac5-082")] : [])],
      clash: [getCard("ac-ac1-027"), getCard("ac-ac1-028")],
      resource: [getCard("ac-ac1-027"), getCard("ac-ac1-028")],
    },
    playerTwo: {
      contender: getCard("ac-st-001"),
      hand: [getCard("ac-ac3-033")],
      clash: [getCard("ac-ac1-027"), getCard("ac-ac1-028")],
      resource: [getCard("ac-ac1-027"), getCard("ac-ac1-028")],
    },
  });
  return new AlphaClashServerEngine(game.state, { human: "player-one", bot: "player-two" });
}

/** A Counter-Attack play opens the Counter-Play window for Rooftop Roll. */
export function createCombatCounterFixture(variant: "targets" | "local-prevention" = "targets") {
  const game = nativeFixtureState({
    id: variant === "targets" ? "combat-counter-targets" : "combat-prevention-local",
    turnNumber: variant === "local-prevention" ? 13 : 5,
    playerOne: {
      contender: getCard("ac-st-001"),
      hand: [getCard("ac-ac5-060"), getCard("ac-ac1-020")],
      clash: [getCard("ac-ac1-027")],
      resource: Array.from({ length: 3 }, () => getCard("ac-ac5-060")),
    },
    playerTwo: {
      contender: getCard("ac-ac1-096"),
      health: 20,
      hand: [getCard("ac-ac1-069")],
      clash: [
        getCard("ac-ac1-028"),
        ...(variant === "local-prevention" ? [getCard("ac-ac1-081")] : []),
      ],
      resource: [
        ...Array.from({ length: 2 }, () => getCard("ac-ac1-069")),
        ...(variant === "local-prevention"
          ? Array.from({ length: 3 }, () => getCard("ac-ac1-081"))
          : []),
      ],
    },
  });
  return new AlphaClashServerEngine(game.state, { human: "player-one", bot: "player-two" });
}

export function createCombatTargetFixture() {
  const game = nativeFixtureState({
    id: "combat-target-legality",
    turnNumber: 5,
    playerOne: {
      contender: getCard("ac-st-001"),
      clash: [getCard("ac-ac1-027"), getCard("ac-ac1-060")],
    },
    playerTwo: {
      contender: getCard("ac-ac1-096"),
      clash: [getCard("ac-ac1-027"), { card: getCard("ac-ac1-028"), ready: false }],
    },
  });
  return new AlphaClashServerEngine(game.state, { human: "player-one", bot: "player-two" });
}

export function createObstructionFixture(
  variant: "flight" | "torment" | "forced" | "forced-unable",
) {
  const game = nativeFixtureState({
    id: `combat-obstruct-${variant}`,
    turnNumber: 17,
    playerOne: {
      contender: getCard("ac-ac1-096"),
      clash: [
        getCard(
          variant === "flight" ? "ac-ac1-081" : variant === "torment" ? "ac-ac6-016" : "ac-ac2-108",
        ),
      ],
      resource: variant.startsWith("forced")
        ? Array.from({ length: 5 }, () => getCard("ac-ac2-108"))
        : [],
      oblivion: variant === "torment" ? officialFixtureCards(15) : [],
    },
    playerTwo: {
      contender: getCard("ac-st-001"),
      clash: [
        { card: getCard("ac-ac1-027"), ready: variant !== "forced-unable" },
        getCard("ac-ac1-060"),
        getCard("ac-ac1-081"),
      ],
      resource: variant.startsWith("forced")
        ? [getCard("ac-ac1-027"), ...Array.from({ length: 5 }, () => getCard("ac-ac1-081"))]
        : [],
    },
  });
  return new AlphaClashServerEngine(game.state, { human: "player-one", bot: "player-two" });
}

/** Terminal-state boundaries begin before the deciding attack or draw. */
export function createGameEndFixture(variant: "lethal" | "deckout") {
  const game = nativeFixtureState({
    id: `finish-${variant}`,
    turnNumber: 91,
    playerOne: {
      contender: getCard("ac-st-001"),
      clash: variant === "lethal" ? [getCard("ac-ac1-027")] : [],
    },
    playerTwo: {
      contender: getCard("ac-ac1-096"),
      health: variant === "lethal" ? 1 : 30,
      // Retain the full owned ledger outside the empty deck. No pending draw
      // or terminal state is injected; End turn reaches the native draw step.
      ...(variant === "deckout" ? { deck: [], oblivion: [...HUNTERS_DECK] } : {}),
    },
  });
  return new AlphaClashServerEngine(game.state, { human: "player-one", bot: "player-two" });
}

export function createAmbushFixture() {
  const gur = getCard("ac-ac3-007");
  const sonoro = getCard("ac-ac1-027");
  const game = nativeFixtureState({
    id: "ambush-set-response",
    turnNumber: 21,
    playerOne: {
      contender: getCard("ac-st-001"),
      hand: [gur, sonoro, getCard("ac-ac7-065")],
      resource: [
        ...Array.from({ length: 4 }, () => gur),
        ...Array.from({ length: 4 }, () => sonoro),
      ],
    },
    playerTwo: {
      contender: getCard("ac-ac1-096"),
      hand: [sonoro],
      clash: [sonoro],
      resource: Array.from({ length: 3 }, () => sonoro),
    },
  });
  return new AlphaClashServerEngine(game.state, { human: "player-one", bot: "player-two" });
}

/** Soul Barrier is installed through a Counter-Play before Erupting Force deals damage. */
export function createSharedNonClashPreventionFixture() {
  const soul = getCard("ac-ac5-025");
  const erupting = getCard("ac-ac4-140");
  const sonoro = getCard("ac-ac1-027");
  const game = nativeFixtureState({
    id: "combat-prevention-non-clash",
    turnNumber: 13,
    playerOne: {
      contender: getCard("ac-st-001"),
      hand: [sonoro],
      clash: [getCard("ac-ac1-081")],
      resource: [sonoro, sonoro, sonoro, getCard("ac-ac1-081"), getCard("ac-ac1-081")],
    },
    playerTwo: {
      contender: getCard("ac-ac1-096"),
      clash: [sonoro, sonoro, sonoro],
      accessory: [
        { card: soul, faceDown: true, setOnTurn: 10 },
        { card: erupting, faceDown: true, setOnTurn: 10 },
      ],
      resource: [soul, soul, erupting, erupting, erupting],
    },
  });
  return new AlphaClashServerEngine(game.state, { human: "player-one", bot: "player-two" });
}
