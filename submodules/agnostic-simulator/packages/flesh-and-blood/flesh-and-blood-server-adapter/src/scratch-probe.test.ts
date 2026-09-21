import { it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { listLegalCommands } from "@tcg/flesh-and-blood-engine/legal-commands";
import { malice } from "@tcg/flesh-and-blood-cards/cards/heroes/malice";
import { dash } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { restlessLooterRed } from "@tcg/flesh-and-blood-cards/cards/actions/restless-looter";

it("probe looter legal commands", () => {
  const game = FabTestEngine.start(
    {
      hero: malice,
      arena: [restlessLooterRed],
      hand: [],
      deck: 4,
    },
    { hero: dash, hand: [], deck: 4 },
    { autoPassPriority: false },
  );
  const runtime = game.getRuntime();
  const actorId = game.as(malice).id;
  const state = runtime.getState();
  const looterId = state.containers.zonesByPlayerId[actorId]!.arena[0]!;
  const viewProbe = (runtime as unknown as { rulesView?: unknown }).rulesView;
  void viewProbe;
  const legal = listLegalCommands(runtime, actorId);
  console.log("ALL legal:");
  for (const command of legal) {
    console.log("  all-cmd:", command.move, "|", command.label);
  }
  console.log(
    "looter:",
    looterId,
    "canonical:",
    state.objects[looterId]?.canonicalId,
    "tapped:",
    state.objects[looterId]?.tapped,
  );
  for (const command of legal) {
    if (command.sourceInstanceId === looterId || command.move === "pass") {
      console.log(
        "cmd:",
        command.move,
        "| label:",
        command.label,
        "| payload keys:",
        Object.keys(command.payload).join(","),
        "| yield:",
        command.priorityYield?.kind ?? "-",
      );
    }
  }
});
