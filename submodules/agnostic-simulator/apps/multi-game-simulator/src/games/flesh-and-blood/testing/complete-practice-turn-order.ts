import { fireEvent, screen, waitFor } from "@testing-library/react";

/** Drive the real decision when the human won the choice; bots choose immediately. */
export async function completePracticeTurnOrder(): Promise<void> {
  await waitFor(
    () => {
      if (
        !screen.queryByRole("button", { name: "Go first" }) &&
        (!screen.queryByTestId("fab-pregame-sideboard") ||
          screen.queryByText("Choosing turn order"))
      ) {
        throw new Error("Waiting for game preparation");
      }
    },
    { timeout: 10_000 },
  );
  const goFirst = screen.queryByRole("button", { name: "Go first" });
  if (goFirst) fireEvent.click(goFirst);
}
