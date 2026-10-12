import { nativeFixtureState } from "./native-fixture-state";
import { getCard } from "@tcg/alpha-clash-cards";
import { AlphaClashServerEngine } from "@tcg/alpha-clash-server-adapter";
export const destinationFixtures = [
  {
    id: "destination-reveal-hand",
    title: "Purging Heat · Reveal an opponent hand",
    description:
      "Attack with Sonoro. Player 2 counters with the set Purging Heat, pays one black resource and discards Denver. Resolve both passes, inspect the revealed opponent hand, then choose a non-Clash card to discard. Unchosen cards become hidden again.",
  },
  {
    id: "destination-discard",
    title: "Denver · Discard to Oblivion",
    description:
      "Play Denver, pass the response window, and accept its draw. Then discard one hand card.",
  },
  {
    id: "destination-banish",
    title: "Trugg · Banish from Oblivion",
    description:
      "Activate Trugg’s second ability and declare a Discarded Clash in Oblivion. Choose a Clash in your Oblivion to banish. The native ability then recovers the previously declared Discarded Clash. Boundary variant: banish the declared card itself; it stays banished and no card returns to hand.",
  },
  {
    id: "destination-return",
    title: "Rebound · Return to hand",
    description:
      "Play Rebound and choose an engaged Clash. Ready cards are illegal. Pass the response window to resolve.",
  },
  {
    id: "destination-send",
    title: "Death · Send to Oblivion",
    description:
      "Activate Death and declare an opposing Oblivion card. Choose a friendly Clash to send to Oblivion. Death then banishes the declared card from Oblivion. Boundary variant: open the Portal first and declare both cards in your Oblivion; a mixed-owner pair must be rejected.",
  },
  {
    id: "destination-select",
    title: "Check out my Ramp · Resource destination",
    description:
      "Play Check out my Ramp, pass the response window, then choose a hand card for the Resource Zone.",
  },
  {
    id: "destination-reveal",
    title: "Archaic Shield · Reveal in place",
    description:
      "Attack with Sonoro. Player 2 responds with Archaic Shield and completes Foretell. The top card is revealed in its deck. Select Done to leave it there, or choose the card to send it to Oblivion. Player 2 chooses.",
  },
] as const;
export function createDestinationFixture(id: string) {
  const sonoro = getCard("ac-ac1-027"),
    magnate = getCard("ac-ac1-028");
  const denver = getCard("ac-ac1-001"),
    trugg = getCard("ac-ac6-181");
  const death = getCard("ac-ac4-008"),
    ramp = getCard("ac-ac5-113"),
    rebound = getCard("ac-ac5-115");
  const shield = getCard(id === "destination-reveal-hand" ? "ac-ac4-023" : "ac-ac5-082"),
    discarded = getCard("ac-ac3-016");
  const game = nativeFixtureState({
    id,
    // Allow ordinary Resource Steps for the arranged resources (502.1c).
    turnNumber: 17,
    portalOpen: id === "destination-banish",
    playerOne: {
      contender: getCard("ac-st-001"),
      deck: [sonoro, magnate, sonoro, magnate],
      hand: [denver, ramp, rebound, magnate],
      clash: [sonoro, trugg, death],
      oblivion: [discarded, magnate],
      resource: [denver, denver, ramp, ramp, rebound, rebound, sonoro, sonoro],
    },
    playerTwo: {
      contender: getCard("ac-ac1-096"),
      deck: [magnate, sonoro, denver],
      hand: [denver],
      clash: [{ card: magnate, ready: id === "combat-prevention" }, sonoro],
      oblivion: [magnate],
      resource: [shield, shield],
      accessory: [{ card: shield, faceDown: true, setOnTurn: 1 }],
    },
  });
  return new AlphaClashServerEngine(game.state, { human: "player-one", bot: "player-two" });
}
