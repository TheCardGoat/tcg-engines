import { nativeFixtureState } from "./native-fixture-state";
import { getCard } from "@tcg/alpha-clash-cards";
import { AlphaClashServerEngine } from "@tcg/alpha-clash-server-adapter";

/**
 * Realistic pile sizes. Morac's native search permits non-Morac, non-Unrivaled
 * Discarded Clash costing three or less, so the deck mixes stackable legal hits
 * with same-size runs of other affiliations.
 */
const DISCARDED_HITS: Array<[string, number]> = [
  ["ac-ac3-010", 3], // Lord Krung, Ruthless Warlord
  ["ac-ac3-007", 3], // Gur, Savage Aggressor
  ["ac-ac3-016", 3], // Trugg, Unusual Assistant
  ["ac-tp1-019", 2], // Discarded Mob
  ["ac-ac7-023", 3], // Thragor, Solitary Hunt
  ["ac-ac6-051", 2], // Cadavros, Vile Virtuoso
  ["ac-ac3-013", 2], // Rizlac, Ferocious Threat
];
const OTHER_CLASH: Array<[string, number]> = [
  ["ac-ac1-027", 3], // Sonoro
  ["ac-ac1-100", 3], // Torque
  ["ac-ac1-003", 3], // Captain Maxine Riggins
  ["ac-ac1-052", 3], // Shadowlight
];

function expand(pairs: Array<[string, number]>) {
  return pairs.flatMap(([id, copies]) => Array.from({ length: copies }, () => getCard(id)));
}

export function createSearchRetrieveFixture(id: string) {
  const search = id.startsWith("search-");
  const empty = id.endsWith("empty");
  const single = id.endsWith("single");
  const source = getCard(search ? "ac-ac3-011" : "ac-ac4-005");
  const weapon = getCard("ac-st2-010");
  const sonoro = getCard("ac-ac1-027");
  const torque = getCard("ac-ac1-100");
  const maxine = getCard("ac-ac1-003");
  const deck = single
    ? [getCard("ac-ac3-007"), ...expand(OTHER_CLASH)]
    : empty
      ? [...expand(OTHER_CLASH), ...expand(OTHER_CLASH)]
      : [...expand(DISCARDED_HITS), ...expand(OTHER_CLASH)];
  const game = nativeFixtureState({
    id: `native-${id}`,
    seed: 31,
    // Allow ordinary Resource Steps for the arranged resources (502.1c).
    turnNumber: 21,
    playerOne: {
      contender: getCard("ac-st-001"),
      hand: [source],
      deck,
      oblivion: search
        ? [sonoro, sonoro, weapon]
        : single
          ? [weapon, sonoro, torque]
          : empty
            ? [sonoro, torque, sonoro]
            : [weapon, weapon, sonoro, sonoro, torque],
      resource: Array.from({ length: 10 }, () => source),
    },
    playerTwo: {
      contender: getCard("ac-ac1-096"),
      hand: [sonoro],
      deck: expand([
        ["ac-ac1-027", 5],
        ["ac-ac3-010", 5],
        ["ac-ac1-100", 5],
        ["ac-ac1-003", 5],
      ]),
      oblivion: [weapon, sonoro, weapon, torque, maxine],
    },
  });
  return new AlphaClashServerEngine(game.state, { human: "player-one", bot: "player-two" });
}
