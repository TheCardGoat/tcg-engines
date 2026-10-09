import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vite-plus/test";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import { TabletopAttachmentStack } from "@tcg/simulator-ui";

afterEach(cleanup);
const card: SimulatorEntity = {
  id: "host",
  ownerId: "player",
  title: "Public host",
  subtitle: "Unit",
  kind: "unit",
  face: "public",
  states: [],
  stats: [],
  traits: [],
};
test("hidden attachment identity is absent from labels and inspection uses its projection", () => {
  const hidden: SimulatorEntity = {
    ...card,
    id: "attachment",
    face: "hidden",
    title: "Secret identity",
  };
  let inspected: SimulatorEntity | undefined;
  render(
    <TabletopAttachmentStack
      entity={card}
      attachments={[hidden]}
      renderEntity={(entity) => (
        <span>{entity.face === "hidden" ? "Card back" : entity.title}</span>
      )}
      onInspect={(entity) => {
        inspected = entity;
      }}
    />,
  );
  expect(screen.queryByText("Secret identity")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Inspect hidden attachment" }));
  expect(inspected).toBe(hidden);
});
test("expanded vertical attachments do not overlap the host card", () => {
  render(
    <TabletopAttachmentStack
      entity={card}
      attachments={[{ ...card, id: "attachment" }]}
      expanded
      width={100}
      renderEntity={(entity) => <span>{entity.id}</span>}
    />,
  );
  const attachment = screen.getByText("attachment").parentElement;
  // jsdom does not lay out cards; verify the physical separation sent to the browser.
  expect(attachment?.style.transform).toBe("translate3d(0px, 156px, 0)");
});
