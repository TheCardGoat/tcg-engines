import { getCard } from "@tcg/alpha-clash-cards";
import { applyCommand, projectState } from "@tcg/alpha-clash-engine";
import { AcTestEngine } from "@tcg/alpha-clash-engine/testing";
import { AlphaClashServerEngine } from "@tcg/alpha-clash-server-adapter";
import { INTERACTION_PROTOCOL_VERSION } from "@tcg/protocol";

/** Deliberate rule-edge fixture, not a constructed tournament deck. */
export function createResourceStepFixture() {
  const game = AcTestEngine.fromFixture({
    id: "resource-step-qa",
    turnNumber: 3,
    phase: { name: "expansion", step: "resource" },
    playerOne: {
      contender: getCard("ac-st-001"),
      deck: 30,
      hand: ["ac-ac1-027", "ac-ac1-028", "ac-ac1-029", "ac-tp1-031", "ac-ac6-170"].map(getCard),
      resource: [getCard("ac-ac6-170")],
    },
    playerTwo: {
      contender: getCard("ac-ac1-096"),
      deck: 30,
      hand: Array.from({ length: 4 }, () => getCard("ac-ac1-027")),
      resource: [getCard("ac-ac1-027"), getCard("ac-ac1-028")],
    },
  });
  return new AlphaClashServerEngine(game.state, { human: "player-one", bot: "player-two" });
}
export function resourceBoard(engine: AlphaClashServerEngine) {
  const projected = projectState(engine.state, "player-one");
  return { ...projected, phaseName: projected.phase.name, standbyCount: projected.standby.length };
}
/** Fixture-only dry runs use isolated native state; UI never owns the rules. */
export function resourceCandidates(engine: AlphaClashServerEngine) {
  return resourceBoard(engine)
    .cards.filter((c) => c.controller === "player-one" && c.zone === "hand")
    .map((card) => {
      const result = applyCommand(structuredClone(engine.state), {
        type: "deployResource",
        playerId: "player-one",
        cardId: card.instanceId,
      });
      return { card, eligible: result.success, reason: result.error };
    });
}
export function submitResourceStep(engine: AlphaClashServerEngine, cardId?: string) {
  const view = engine.getInteractionView("human");
  const action = view.actions.find(
    (a) => a.id === (cardId ? "deployResource" : "passResource") && a.enabled,
  );
  if (!action) return { success: false, error: "The Resource Step has ended." };
  return engine.submitInteraction(
    "human",
    {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      stateVersion: view.stateVersion,
      requestId: action.requestId,
      actionId: action.id,
      values: cardId ? { cardId: [cardId] } : {},
    },
    { gameId: "resource-step-qa", sourceAuthority: "server" },
  );
}
