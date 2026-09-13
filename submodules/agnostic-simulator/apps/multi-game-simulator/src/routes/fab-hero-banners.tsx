import { useEffect, useState } from "react";
import { Alert, Button, Group, Pagination, Select, Stack, Text, Title } from "@mantine/core";
import { HeroPanel } from "../games/flesh-and-blood/FabPregameSideboard";
import { FabCardPreviewProvider } from "../games/flesh-and-blood/FabCardPreview";
import { loadHeroIndex } from "../games/flesh-and-blood/heroMedia";
import "../games/flesh-and-blood/flesh-and-blood.css";

const pageSize = 12;

export default function FabHeroBanners() {
  const [heroes, setHeroes] = useState<Awaited<ReturnType<typeof loadHeroIndex>>>(null);
  const [loaded, setLoaded] = useState(false);
  const [hero, setHero] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    void loadHeroIndex().then((index) => {
      if (active) {
        setHeroes(index);
        setLoaded(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);
  const entries = heroes?.heroes ?? [];
  const options = entries.map((entry) => ({
    value: entry.slug ?? entry.name,
    label: `${entry.name}${entry.slug ? ` (${entry.slug})` : ""}`,
  }));
  const filtered = hero ? entries.filter((entry) => (entry.slug ?? entry.name) === hero) : entries;
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <FabCardPreviewProvider>
      <main style={{ padding: 16, minHeight: "100vh", background: "#0b1117", color: "#f4f4f5" }}>
        <Stack gap="md">
          <Title order={1}>FAB hero banner test</Title>
          <Group align="end">
            <Select
              label="Hero"
              placeholder="All heroes"
              searchable
              clearable
              data={options}
              value={hero}
              onChange={(value) => {
                setHero(value);
                setPage(1);
              }}
            />
            <Button variant="default" onClick={() => setAttempt((value) => value + 1)}>
              Reload media
            </Button>
          </Group>
          {!loaded ? (
            <Text>Loading hero catalog…</Text>
          ) : !entries.length ? (
            <Alert color="red">Hero catalog could not be loaded. Reload the page to retry.</Alert>
          ) : null}
          {visible.map((entry) => (
            <Stack key={entry.slug ?? entry.name} gap="xs">
              <div key={attempt}>
                <div style={{ overflowX: "auto" }}>
                  <div className="fab-sideboard-matchup" style={{ height: 120, minWidth: 760 }}>
                    <HeroPanel
                      mediaIdentity={entry.slug ?? entry.name}
                      side="self"
                      status="pending"
                      participant={{
                        label: "Image",
                        heroName: entry.name,
                        subscriptionTier: "free",
                      }}
                    />
                    <div style={{ display: "grid", placeContent: "center", textAlign: "center" }}>
                      <strong>0:20</strong>
                      <Text size="xs">Classic Constructed</Text>
                    </div>
                    <HeroPanel
                      mediaIdentity={entry.slug ?? entry.name}
                      side="opponent"
                      status="ready"
                      participant={{
                        label: "Video",
                        heroName: entry.name,
                        subscriptionTier: "supporter",
                      }}
                    />
                  </div>
                </div>
              </div>
            </Stack>
          ))}
          {filtered.length > pageSize ? (
            <Pagination
              value={page}
              onChange={setPage}
              total={Math.ceil(filtered.length / pageSize)}
              aria-label="Hero pages"
            />
          ) : null}
        </Stack>
      </main>
    </FabCardPreviewProvider>
  );
}
