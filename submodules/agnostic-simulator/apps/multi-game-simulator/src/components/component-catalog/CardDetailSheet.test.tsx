import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vite-plus/test";
import { MantineProvider } from "@mantine/core";
import { CardDetailSheet } from "@tcg/simulator-ui";
import type { SimulatorEntity } from "@tcg/simulator-contract";

afterEach(cleanup);
const card: SimulatorEntity = {
  id: "private",
  ownerId: "owner",
  title: "Secret identity",
  subtitle: "Secret faction",
  face: "hidden",
  kind: "unit",
  states: ["ready"],
  stats: [{ label: "Secret stat", value: "9" }],
  traits: ["Secret trait"],
  imageUrl: "/private-art.webp",
  backImageUrl: "/public-back.webp",
};
test("detail sheets exclude hidden identity, metadata, and private art", () => {
  render(
    <MantineProvider>
      <CardDetailSheet entity={card} open />
    </MantineProvider>,
  );
  const dialog = screen.getByRole("dialog", { name: "Hidden card details" });
  expect(dialog.textContent).not.toContain("Secret");
  expect(document.querySelector('img[src="/private-art.webp"]')).toBeNull();
});
test("the native trigger requests opening and the modal exposes its close action", async () => {
  const onOpen = vi.fn();
  const onClose = vi.fn();
  const { rerender } = render(
    <MantineProvider>
      <CardDetailSheet
        entity={{ ...card, face: "public" }}
        open={false}
        onOpen={onOpen}
        onClose={onClose}
      >
        Inspect card
      </CardDetailSheet>
    </MantineProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Inspect card" }));
  expect(onOpen).toHaveBeenCalledOnce();
  rerender(
    <MantineProvider>
      <CardDetailSheet entity={{ ...card, face: "public" }} open onClose={onClose} />
    </MantineProvider>,
  );
  fireEvent.click(await screen.findByRole("button", { name: "Close card details" }));
  expect(onClose).toHaveBeenCalledOnce();
});
