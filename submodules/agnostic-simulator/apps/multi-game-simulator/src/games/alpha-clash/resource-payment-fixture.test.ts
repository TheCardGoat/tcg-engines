import { expect, test } from "vitest";
import { buildInteractionSubmission, EngineInteractionView } from "@tcg/protocol";
import { createResourcePaymentFixture } from "./resource-payment-fixture";
function setup() {
  const engine = createResourcePaymentFixture();
  const view = engine.getInteractionView("human");
  const action = view.actions.find((a) => a.text.key.includes("Apex, the Fastest"))!;
  const input = action.inputs.find((i) => i.id === "resourcePayment");
  if (input?.kind !== "option-selection" || input.presentation?.kind !== "cost-slots")
    throw new Error("Missing payment slots");
  const slots = input.presentation.slots;
  const blue = input.options.find((o) => o.text.key.endsWith("blue"))!;
  const green = input.options.find(
    (o) => o.text.key.endsWith("green") && o.entity?.instanceId !== blue.entity?.instanceId,
  )!;
  const pay = (ids: string[]) =>
    engine.submitInteraction(
      "human",
      buildInteractionSubmission({ view, action, values: { resourcePayment: ids } }),
      { gameId: "payment", sourceAuthority: "server" },
    );
  return { engine, view, action, input, slots, blue, green, pay };
}
test("native cost quote and viewer-safe slots leave resources in place", () => {
  const { engine, view, input, slots } = setup();
  expect(EngineInteractionView.safeParse(view).success).toBe(true);
  expect(input.min).toBe(2);
  expect(slots.map((s) => s.text.key)).toEqual(["blue resource", "green resource"]);
  const before = structuredClone(engine.state);
  engine.getInteractionView("human");
  expect(engine.state).toEqual(before);
  for (const option of input.options)
    expect(engine.state.cards[option.entity!.instanceId]).toMatchObject({
      controller: "player-one",
      zone: "resource",
      ready: true,
    });
  expect(
    engine
      .getInteractionView("bot")
      .actions.some((a) => a.inputs.some((i) => i.id === "resourcePayment")),
  ).toBe(false);
});
test("complete native payment engages only selected distinct resources", () => {
  const { engine, action, blue, green, pay } = setup();
  expect(pay([blue.id, green.id]).success).toBe(true);
  expect(engine.state.cards[blue.entity!.instanceId].ready).toBe(false);
  expect(engine.state.cards[green.entity!.instanceId].ready).toBe(false);
  expect(
    Object.values(engine.state.cards).filter(
      (c) => c.zone === "resource" && c.controller === "player-one" && c.ready,
    ),
  ).toHaveLength(1);
  expect(engine.state.standby).toHaveLength(0);
  expect(engine.state.cards[action.source!.instanceId]).toMatchObject({
    zone: "clash",
    ready: true,
  });
});
test("illegal and duplicate declarations preserve state and allow retry", () => {
  const { engine, input, blue, green, pay } = setup();
  const before = structuredClone(engine.state);
  const sameCardGreen = input.options.find(
    (o) => o.entity?.instanceId === blue.entity?.instanceId && o.text.key.endsWith("green"),
  )!;
  for (const ids of [
    [],
    [blue.id],
    [green.id, blue.id],
    [blue.id, sameCardGreen.id],
    ["hidden", green.id],
  ]) {
    expect(pay(ids).success).toBe(false);
    expect(engine.state).toEqual(before);
  }
  expect(pay([blue.id, green.id]).success).toBe(true);
  expect(pay([blue.id, green.id]).success).toBe(false);
});

test("generic slots accept an explicitly declared color from distinct multicolor resources", () => {
  const engine = createResourcePaymentFixture();
  const view = engine.getInteractionView("human");
  const action = view.actions.find((a) => a.text.key.includes("Avenging Guy, Trying to Help"))!;
  const input = action.inputs.find((i) => i.id === "resourcePayment");
  if (input?.kind !== "option-selection" || input.presentation?.kind !== "cost-slots")
    throw new Error("Missing generic slots");
  expect(input.presentation.slots.map((slot) => slot.text.key)).toEqual([
    "green resource",
    "Any resource",
    "Any resource",
  ]);
  const green = input.options.find((o) => o.text.key.startsWith("Magnate"))!;
  const blue = input.options.filter((o) => o.text.key.endsWith("blue"));
  const result = engine.submitInteraction(
    "human",
    buildInteractionSubmission({
      view,
      action,
      values: { resourcePayment: [green.id, blue[0]!.id, blue[1]!.id] },
    }),
    { gameId: "generic-payment", sourceAuthority: "server" },
  );
  expect(result.success).toBe(true);
  expect(
    Object.values(engine.state.cards).filter(
      (c) => c.zone === "resource" && c.controller === "player-one" && c.ready,
    ),
  ).toHaveLength(0);
});
