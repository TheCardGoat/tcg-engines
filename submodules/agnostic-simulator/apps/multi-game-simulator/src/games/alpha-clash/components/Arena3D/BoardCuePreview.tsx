// Presentation samples only. Never change native turn, priority, or legal actions.
const samples = [
  { id: "your-turn", label: "Your turn · Your priority", ownTurn: true, priority: "you" },
  {
    id: "opponent-response",
    label: "Your turn · Opponent responds",
    ownTurn: true,
    priority: "opponent",
  },
  {
    id: "opponent-turn",
    label: "Opponent turn · Opponent priority",
    ownTurn: false,
    priority: "opponent",
  },
  { id: "your-response", label: "Opponent turn · Your response", ownTurn: false, priority: "you" },
  { id: "resolving", label: "Your turn · Resolving", ownTurn: true, priority: "none" },
] as const;

export function boardCueSample() {
  if (
    typeof window === "undefined" ||
    !window.location.pathname.includes("/alpha-clash/simulator/tests/")
  )
    return undefined;
  const id = new URLSearchParams(window.location.search).get("board-cues");
  return samples.find((sample) => sample.id === id);
}

export function BoardCuePreviewPicker() {
  const sample = boardCueSample();
  if (!sample) return null;
  return (
    <label
      style={{
        position: "absolute",
        top: 80,
        left: 12,
        zIndex: 50,
        color: "#c7d9df",
        background: "#08131eed",
        padding: "8px 12px",
        border: "1px solid #45616d",
        borderRadius: 6,
        fontSize: 12,
      }}
    >
      Visual preview · Board cues only
      <br />
      <select
        aria-label="Board cue sample"
        value={sample.id}
        style={{ marginTop: 5, background: "#142733", color: "#e7f6fa", border: 0, padding: 4 }}
        onChange={(event) => {
          const url = new URL(window.location.href);
          url.searchParams.set("board-cues", event.target.value);
          window.location.assign(url);
        }}
      >
        {samples.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}
