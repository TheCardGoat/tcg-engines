export interface SwuSetDefinition {
  id: string;
  code: string;
  name: string;
  releaseDate?: string;
}

export const sets: Record<string, SwuSetDefinition> = {
  sor: {
    id: "sor",
    code: "SOR",
    name: "Spark of Rebellion",
    releaseDate: "2024-03-08",
  },
  shd: {
    id: "shd",
    code: "SHD",
    name: "Shadows of the Galaxy",
    releaseDate: "2024-07-09",
  },
  twi: {
    id: "twi",
    code: "TWI",
    name: "Twilight of the Republic",
    releaseDate: "2024-11-08",
  },
  jtl: {
    id: "jtl",
    code: "JTL",
    name: "Jump to Lightspeed",
    releaseDate: "2025-01-17",
  },
  lof: {
    id: "lof",
    code: "LOF",
    name: "Legends of the Force",
    releaseDate: "2025-03-14",
  },
  law: {
    id: "law",
    code: "LAW",
    name: "A Lawless Time",
    releaseDate: "2026-03-13",
  },
  sec: {
    id: "sec",
    code: "SEC",
    name: "Secrets of Power",
    releaseDate: "2025-11-07",
  },
  ts26: {
    id: "ts26",
    code: "TS26",
    name: "Twin Suns 2026",
    releaseDate: "2026-04-01",
  },
  ash: {
    id: "ash",
    code: "ASH",
    name: "Ashes of the Empire",
    releaseDate: "2026-07-01",
  },
  ibh: {
    id: "ibh",
    code: "IBH",
    name: "Intro Battle: Hoth",
  },
};

export const allSets: SwuSetDefinition[] = Object.values(sets).sort((a, b) =>
  (a.releaseDate ?? "").localeCompare(b.releaseDate ?? ""),
);
