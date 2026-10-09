import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { eb02BrandNewWorld040 } from "@tcg/op-cards";

import { defineTopFourCostSearchEventTests } from "./top-four-cost-search.shared.ts";

defineTopFourCostSearchEventTests(eb02BrandNewWorld040);

test("Life Trigger reveals and adds a cost-four Event and preserves ordered remainder", () => {
  const e = OnePieceTestEngine.create(
    { character: ["EB01-018"] },
    { life: ["EB02-040"], deck: ["EB02-059", "EB01-005", "EB01-014", "EB01-025", "EB01-018"] },
  );
  const selected = e.findCardInZone("north", "deck", "EB02-059"),
    a = e.findCardInZone("north", "deck", "EB01-005"),
    c = e.findCardInZone("north", "deck", "EB01-014"),
    d = e.findCardInZone("north", "deck", "EB01-025"),
    untouched = e.findCardInZone("north", "deck", "EB01-018");
  e.asSouth().attack("EB01-018", e.leader("north"));
  e.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
  const p = e.pendingDecision("effectSearchSelection", "north").steps[0];
  if (p.kind !== "selectEntity") throw Error("search");
  expect(p.candidates.filter((x) => x.legal).map((x) => x.ref.id)).toEqual([selected, c]);
  e.resolveDecision("effectSearchSelection", { selectedIds: [selected] }, "north");
  e.resolveDecision("effectSearchRemainderOrder", { selectedIds: [d, c, a] }, "north");
  expect(e.getView("north").players.north.hand.map((c) => c.instanceId)).toEqual([selected]);
  expect(e.getState().players.north.deck).toEqual([untouched, d, c, a]);
  expect(e.getView("north").players.north.activeDon).toBe(0);
  expect(e.getView("north").players.north.trash.map((c) => c.cardId)).toContain("EB02-040");
  expect(e.getView("north").prompts).toHaveLength(0);
});
