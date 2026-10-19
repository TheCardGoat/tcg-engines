import { expect, it } from "vite-plus/test";
import { getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const ancient = getCard("ac-ac1-070"),
  weapon = getCard("ac-ac6-162"),
  ambush = getCard("ac-ac3-007");
it.each(["oblivion", "hand", "ambush"] as const)(
  "Ancient Protection submits its %s Accessory target through the interaction protocol",
  (kind) => {
    const g = Spec.fromFixture({
      playerOne: {
        hand: kind === "hand" ? [ancient, weapon] : [ancient],
        resource: [ancient, ancient],
      },
      playerTwo: {
        oblivion: kind === "oblivion" ? [weapon] : [],
        accessory: kind === "ambush" ? [{ card: ambush, faceDown: true, setOnTurn: 1 }] : [],
      },
    });
    const target =
      kind === "hand"
        ? g.playerOne.at(weapon, "hand")
        : kind === "oblivion"
          ? g.playerTwo.at(weapon, "oblivion")
          : g.playerTwo.at(ambush, "accessory");
    const engine = new AlphaClashServerEngine(g.state, { p1: "player-one", p2: "player-two" });
    const view = engine.getInteractionView("p1");
    const action = view.actions.find(
      (a) => a.id === `playCard:${g.playerOne.hand(ancient).instanceId}`,
    );
    if (!action) throw Error("Missing Ancient Protection play");
    const input = action.inputs.find((i) => i.id === "targetId");
    if (input?.kind !== "entity-selection") throw Error("Missing target input");
    expect(input.candidates.map((c) => c.entity.instanceId)).toContain(target.instanceId);
    const result = engine.submitInteraction(
      "p1",
      buildInteractionSubmission({
        view,
        action,
        values: {
          targetId: [target.instanceId],
          resourcePayment: g.playerOne
            .instances(ancient)
            .filter((card) => card.zone === "resource")
            .map((card) => JSON.stringify([card.instanceId, "white"])),
        },
      }),
      { gameId: "ancient-interactions", sourceAuthority: "server" },
    );
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(result.acceptedMoveRecord?.processedCommand).toMatchObject({
      targetId: target.instanceId,
    });
    for (let i = 0; i < 30 && engine.state.responseWindow; i++)
      expect(
        engine.dispatch(
          "pass",
          engine.getActivePlayerId()!,
          {},
          { gameId: "ancient-interactions", sourceAuthority: "server" },
        ).success,
      ).toBe(true);
    expect(engine.state.cards[target.instanceId].zone).toBe("oblivion");
  },
);
