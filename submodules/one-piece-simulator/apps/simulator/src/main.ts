import StartGame from "./game/main";
import { stringifySimulatorConnectionDiagnostic } from "@tcg/game-page-contract/connection-diagnostic";

document.addEventListener("DOMContentLoaded", () => {
  installConnectionDiagnosticButton();
  StartGame("game-container");
});

function installConnectionDiagnosticButton(): void {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Copy diagnostic JSON";
  button.setAttribute("aria-label", "Copy connection diagnostic JSON");
  Object.assign(button.style, {
    position: "fixed",
    top: "12px",
    right: "12px",
    zIndex: "20",
    border: "1px solid rgba(255,255,255,0.35)",
    borderRadius: "6px",
    background: "rgba(0,0,0,0.72)",
    color: "white",
    cursor: "pointer",
    font: "600 11px system-ui, sans-serif",
    padding: "7px 10px",
  });
  button.addEventListener("click", async () => {
    const payload = stringifySimulatorConnectionDiagnostic({
      gameSlug: "one-piece",
      route: `${window.location.pathname}${window.location.search}`,
      endpoint: { realtimeConfigured: false },
      connection: { status: "unavailable" },
      events: [
        {
          at: new Date().toISOString(),
          type: "realtime_unavailable",
          message: "One Piece simulator does not expose a live gateway connection.",
        },
      ],
    });
    try {
      await navigator.clipboard.writeText(payload);
      button.textContent = "Diagnostic copied";
    } catch {
      button.textContent = "Copy unavailable";
    }
  });
  document.body.append(button);
}
