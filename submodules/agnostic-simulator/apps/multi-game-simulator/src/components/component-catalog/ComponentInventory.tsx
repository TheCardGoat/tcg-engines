import { useState } from "react";
import inventory from "./component-inventory.json";
import { registeredFamily } from "./fixture-registry";
import classes from "./ComponentInventory.module.css";
export default function ComponentInventory({
  game,
  onPreview,
}: {
  game: string;
  onPreview: (game: string, family: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState(false);
  const scope = inventory.filter(
    (item) => item.game === "shared" || game === "all" || item.game === game,
  );
  const registered = scope.filter((item) => registeredFamily(item.game, item.name));
  const rows = scope.filter(
    (item) =>
      (!pending || !registeredFamily(item.game, item.name)) &&
      `${item.name} ${item.game} ${item.source}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <section className={classes.root} aria-label="Component inventory">
      <h2>Component inventory and implementation coverage</h2>
      <p>
        {scope.length} public components and compositions · {registered.length} with registered live
        fixtures · {scope.length - registered.length} need a dedicated fixture or an explicit
        composition mapping.
      </p>
      <p>
        Registration does not prove production adoption or browser verification. Internal functions
        are represented by their owning exported surface. No component is marked covered only
        because its source file exists.
      </p>
      <div className={classes.controls}>
        <label>
          Find component{" "}
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <label>
          <input type="checkbox" checked={pending} onChange={(e) => setPending(e.target.checked)} />{" "}
          Show missing fixtures only
        </label>
      </div>
      <div className={classes.scroll}>
        <table>
          <thead>
            <tr>
              <th>Component</th>
              <th>Owner</th>
              <th>Kind</th>
              <th>Implementation</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => {
              const family = registeredFamily(item.game, item.name);
              return (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.game}</td>
                  <td>{item.role}</td>
                  <td>
                    {family ? (
                      <button
                        onClick={() =>
                          onPreview(
                            family === "Dice"
                              ? "cyberpunk"
                              : item.game === "shared"
                                ? game === "all"
                                  ? "cyberpunk"
                                  : game
                                : item.game,
                            family,
                          )
                        }
                      >
                        Open live fixture
                      </button>
                    ) : (
                      "Needs fixture"
                    )}
                  </td>
                  <td>
                    <code>{item.source}</code>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p role="status">{rows.length} inventory entries shown.</p>
    </section>
  );
}
