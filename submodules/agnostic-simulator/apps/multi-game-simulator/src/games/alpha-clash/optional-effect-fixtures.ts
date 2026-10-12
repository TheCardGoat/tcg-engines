import { nativeFixtureState, officialFixtureCards } from "./native-fixture-state";
import { getCard } from "@tcg/alpha-clash-cards";
import { AlphaClashServerEngine } from "@tcg/alpha-clash-server-adapter";

export const optionalEffectFixtures = [
  {
    id: "optional-restore",
    title: "Restore · Use or decline",
    description:
      "Start a clash with Warcry against the opposing contender. Pass through the clash steps without obstructing. After damage, choose Use or Decline for Restore 1.",
  },
  {
    id: "optional-restore-empty",
    title: "Restore · Empty Oblivion",
    description:
      "Attack Torque with Warcry and pass without obstructing. Restore 1 still offers Use or Decline; an empty Oblivion produces no return and does not undo the damage.",
  },
  {
    id: "optional-restore-one",
    title: "Restore · One Oblivion card",
    description:
      "Attack Torque with Warcry and pass without obstructing. Use returns the only Oblivion card, Sonoro, to the deck bottom; Decline keeps it in place.",
  },
  {
    id: "optional-wrath",
    title: "Wrath · Reveal and bottom a Dragon",
    description:
      "Inspect Dragon's Breath in your accessories and activate its Engage ability. Wrath opens immediately. Choose Use and select Fangyin from hand to reveal and bottom it, then damage every Clash card; Decline keeps the engage cost paid. Sonoro is not a Dragon.",
  },
  {
    id: "optional-wrath-no-dragon",
    title: "Wrath · No eligible Dragon",
    description:
      "Activate Dragon's Breath through accessory inspection. Neither hand card is a Dragon. Use or Decline completes without a reveal, return or damage; the source stays engaged.",
  },
  {
    id: "optional-wrath-two-dragons",
    title: "Wrath · Two matching Dragons",
    description:
      "Activate Dragon's Breath, choose Use, and select exactly one of the two Fangyin cards in hand. Only the selected instance is revealed and returned to deck bottom before damage.",
  },
  {
    id: "optional-temper",
    title: "Temper · Use or decline",
    description:
      "Attach Heavy Metal to Gearwin. The attachment pays one red resource. Then choose Use or Decline to put a Temper Counter on Heavy Metal.",
  },
  {
    id: "optional-void",
    title: "Void · Optional banish, mandatory draw",
    description:
      "End your turn with the Portal open. The Absence then offers to banish the top card. Use it to banish Breach the Void, whose Void draw is mandatory. The contender draw is optional.",
  },
  {
    id: "optional-void-no-void",
    title: "Void · Top card has no Void trigger",
    description:
      "End your turn with the Portal open. The Absence offers to banish Warcry, which has no Void trigger. The following contender draw remains optional; Decline draws nothing.",
  },
  {
    id: "optional-void-full-health",
    title: "Void · At the printed health threshold",
    description:
      "The Absence starts at its full printed 25 health with the Portal open. End turn still triggers the optional banish; Breach the Void's later draw is mandatory.",
  },
  {
    id: "optional-void-empty-deck",
    title: "Void · Empty deck before trigger",
    description:
      "End turn with the Portal open and a complete official card ledger in other zones. The Absence does not offer top-card banish when its deck is empty.",
  },
  {
    id: "optional-void-last-card",
    title: "Void · Banish the last card",
    description:
      "End turn with only Breach the Void in the deck. Decline the banish to keep it; Use banishes it, and the later draw attempt from an empty deck ends the game even if the contender draw is declined.",
  },
] as const;

/** Start before the trigger: the player performs every activation through the normal board. */
export function createOptionalEffectFixture(id: string): AlphaClashServerEngine {
  const sonoro = getCard("ac-ac1-027");
  const warcry = getCard("ac-tp1-017");
  const gearwin = getCard("ac-ac7-150");
  const weapon = getCard("ac-st2-010");
  const breath = getCard("ac-ac7-162");
  const dragon = getCard("ac-ac6-053");
  const voidCard = getCard("ac-ac7-004");
  const isVoid = id.startsWith("optional-void");
  const isEmptyDeck = id === "optional-void-empty-deck";
  const isLastCard = id === "optional-void-last-card";
  const isRestore = id.startsWith("optional-restore");
  const isWrath = id.startsWith("optional-wrath");
  const game = nativeFixtureState({
    id,
    // Allow ordinary Resource Steps for the arranged resources (502.1c).
    turnNumber: 9,
    portalOpen: isVoid,
    playerOne: {
      contender: getCard(isVoid ? "ac-ac7-001" : "ac-st-001"),
      health: isVoid ? (id === "optional-void-full-health" ? 25 : 24) : 26,
      deck: isEmptyDeck
        ? []
        : isLastCard
          ? [voidCard]
          : id === "optional-void-no-void"
            ? [warcry, voidCard, sonoro, sonoro, dragon, sonoro]
            : [voidCard, sonoro, warcry, sonoro, dragon, sonoro],
      hand:
        id === "optional-wrath-no-dragon"
          ? [sonoro, sonoro]
          : id === "optional-wrath-two-dragons"
            ? [dragon, dragon]
            : [dragon, sonoro],
      clash: isRestore ? [warcry] : id === "optional-temper" ? [gearwin, sonoro] : [sonoro],
      accessory: isWrath ? [breath] : [weapon],
      resource: [breath, breath, sonoro, sonoro],
      oblivion: isEmptyDeck
        ? officialFixtureCards(42)
        : isLastCard
          ? officialFixtureCards(41)
          : id === "optional-restore-empty"
            ? []
            : id === "optional-restore-one"
              ? [sonoro]
              : [sonoro, dragon],
    },
    playerTwo: {
      contender: getCard("ac-ac1-096"),
      hand: [dragon, sonoro],
      deck: [sonoro, dragon, warcry],
      clash: [sonoro],
    },
  });
  if (!optionalEffectFixtures.some((fixture) => fixture.id === id))
    throw new Error(`Unknown optional fixture: ${id}`);
  return new AlphaClashServerEngine(game.state, { human: "player-one", bot: "player-two" });
}
