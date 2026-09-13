import { Button, Group } from "@mantine/core";
import { SimulatorRouteStatus } from "@tcg/simulator-ui";
import type { GameSlug } from "@tcg/simulator-contract";
import { matchReturnUrl } from "./match-return-url";
import { useLocation, useRevalidator } from "react-router";

export function MatchUnavailable({ gameSlug, message }: { gameSlug: GameSlug; message: string }) {
  const revalidator = useRevalidator();
  const { search } = useLocation();

  return (
    <SimulatorRouteStatus
      title="Match unavailable"
      message={message}
      action={
        <Group>
          <Button
            component="a"
            href={matchReturnUrl(gameSlug, search)}
            variant="filled"
            color="blue"
          >
            Back to matchmaking
          </Button>
          <Button
            variant="default"
            loading={revalidator.state === "loading"}
            onClick={() => void revalidator.revalidate()}
          >
            Try again
          </Button>
        </Group>
      }
    />
  );
}
