export function GameTable({ children }: { children: React.ReactNode }) {
  return (
    <section
      className="board-bg flex-1 flex flex-col min-w-0 relative overflow-hidden"
      data-sim-board
    >
      {children}
    </section>
  );
}
