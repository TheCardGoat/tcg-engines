import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { fabToken } from "../../../../testing/test-fixtures.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { mbrioBaseDigits } from "../../../../../../cards/src/cards/equipment/mbrio-base-digits.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";

function armsDefense(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
): number | undefined {
  const state = game.getState();
  const instanceId = state.containers.zonesByPlayerId[playerId]?.arms.find(
    (id) => state.objects[id]?.canonicalId === mbrioBaseDigits.canonicalId,
  );
  if (!instanceId) return undefined;
  return buildFabRulesView(state).object({
    instanceId,
    incarnation: state.objects[instanceId]!.incarnation,
  })?.current.numeric.defense;
}

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 24; safety += 1) {
    if (game.getState().rulesStack.length === 0) return;
    const priority = game.getState().priority?.holderPlayerId;
    if (!priority) return;
    game.exec({ move: "pass", actorId: priority, payload: {} });
  }
}

describe("mbrio-base-digits (PEN060)", () => {
  it("taps itself and a controlled Cog to gain +1{d} until end of turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arms: [mbrioBaseDigits], arena: [fabToken("golden-cog")], deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const cogId = Bravo.findCardInZone("arena", fabToken("golden-cog"));

    expect(armsDefense(game, Bravo.id)).toBe(1);
    Bravo.activate(mbrioBaseDigits);
    drain(game);

    expect(armsDefense(game, Bravo.id)).toBe(2);
    expect(game.getState().objects[cogId]?.markers.some((marker) => marker.kind === "tapped")).toBe(
      true,
    );
  });

  it("is illegal with no Cog or after its Cog has been tapped", () => {
    const noCog = FabTestEngine.start(
      { hero: bravo, arms: [mbrioBaseDigits], deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => noCog.as(bravo).activate(mbrioBaseDigits)).toThrow();

    const spentCog = FabTestEngine.start(
      { hero: bravo, arms: [mbrioBaseDigits], arena: [fabToken("golden-cog")], deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const player = spentCog.as(bravo);
    player.activate(mbrioBaseDigits);
    drain(spentCog);
    expect(() => player.activate(mbrioBaseDigits)).toThrow();
  });
});
