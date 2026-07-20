import { MatchEventLog } from "../ui/MatchSidebar.tsx";
import { useMatchLogData } from "./MatchSidebarContainer.tsx";

export function MatchLogContainer() {
  const { log, eventLogEntries } = useMatchLogData();

  return (
    <section
      className="gd-dark-surface gd-command-surface flex h-full min-h-0 flex-col pt-10"
      aria-label="Game log panel"
    >
      <MatchEventLog log={log} eventLogEntries={eventLogEntries} />
    </section>
  );
}
