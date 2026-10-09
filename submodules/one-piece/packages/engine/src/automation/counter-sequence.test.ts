import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../index.ts";
import { applyCommand, getLegalCommands } from "../core.ts";
import { aggressiveAgent, heuristicAgent } from "./heuristic-strategy.ts";

test.each([heuristicAgent, aggressiveAgent])(
  "Counter strategy submits one card at a time and completes an affordable defense",
  (agent) => {
    let e = OnePieceTestEngine.create(
      { hand: ["ST02-006", "ST02-006"], life: 1 },
      { character: [{ cardId: "ST02-002", playedOnTurn: 0, attachedDon: 1 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    e.asNorth().attack(e.findCardInZone("north", "character", "ST02-002"), e.leader("south"));
    e.pendingDecision("battleCounter", "south");
    let spent = 0;
    for (let step = 0; step < 5; step++) {
      const state = e.getState();
      const prompt = state.promptQueue.find(
        (p) => p.status === "pending" && p.resolutionContext?.intent === "battleCounter",
      );
      if (!prompt) break;
      if (!agent.resolvePrompt) throw new Error("Expected a prompt resolver");
      const command = agent.resolvePrompt(state, prompt);
      expect(command?.type).toBe("resolvePrompt");
      if (!command || command.type !== "resolvePrompt")
        throw new Error("Expected Counter decision");
      expect(command.selectedIds?.length ?? 0).toBeLessThanOrEqual(1);
      expect(
        getLegalCommands(state, "south").some(
          (legal) => legal.type === "resolvePrompt" && legal.promptId === prompt.id,
        ),
      ).toBe(true);
      spent += command.selectedIds?.length ?? 0;
      const result = applyCommand(state, command);
      expect(result.accepted).toBe(true);
      e = OnePieceTestEngine.fromState(result.state);
    }
    expect(spent).toBe(2);
    expect(e.getView("south").players.south.lifeCount).toBe(1);
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  },
);
