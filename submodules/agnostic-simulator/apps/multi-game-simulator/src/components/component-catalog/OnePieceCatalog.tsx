import { useMemo, useState } from "react";
import { CardFace } from "@tcg/simulator-ui";
import { buildOnePieceBoardFromFixture } from "../../games/one-piece/data/projectVisualFixture";
import { ONE_PIECE_VISUAL_FIXTURES } from "../../games/one-piece/data/visualFixtures";
import { PlayerMat } from "../../games/one-piece/components/OnePieceTabletopBoard";
import boardStyles from "../../games/one-piece/components/OnePieceTabletopBoard.module.css";
import Workbench, { Specimen, variantEntity } from "./Workbench";
import "../../games/one-piece/components/OnePieceTabletopBoard.module.css";
export default function OnePieceCatalog({ category }: { category: string }) {
  const [fixtureId, setFixtureId] = useState("resource-board-state");
  const board = useMemo(
    () => buildOnePieceBoardFromFixture(ONE_PIECE_VISUAL_FIXTURES.find((f) => f.id === fixtureId)!),
    [fixtureId],
  );
  return (
    <>
      <label>
        Fixture state{" "}
        <select value={fixtureId} onChange={(e) => setFixtureId(e.target.value)}>
          {ONE_PIECE_VISUAL_FIXTURES.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
      </label>
      <Workbench
        key={fixtureId}
        category={category}
        game="one-piece"
        boardHref={`/one-piece/simulator/tests/${fixtureId}`}
        source="OnePieceTabletopBoard · CardFace"
        entities={board.entities}
        zones={board.table.zones}
        table={board.table}
        zonePreview={
          <Specimen
            title="Player mat, DON!!, life and card piles"
            source="OnePieceTabletopBoard/PlayerMat"
          >
            <div className={boardStyles.tabletop} style={{ width: "100%" }}>
              <PlayerMat
                seatId="player"
                table={board.table}
                donTokens={board.donTokens.player}
                entityMap={new Map(board.entities.map((entity) => [entity.id, entity]))}
              />
            </div>
          </Specimen>
        }
        supported={["rested", "hidden", "selected", "targetable", "highlighted"]}
        renderCard={(entity, knobs) => (
          <CardFace
            entity={variantEntity(entity, knobs)}
            density="full"
            selected={knobs.selected}
            targetable={knobs.targetable}
            highlighted={knobs.highlighted}
          />
        )}
      />
    </>
  );
}
