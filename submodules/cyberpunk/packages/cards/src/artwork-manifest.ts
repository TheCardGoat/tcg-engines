/**
 * Reviewed Cyberpunk appearance catalog. Printings in an art group show the
 * same visible illustration and presentation; set and collector metadata do
 * not create new art. A non-standard group has a visible alternate treatment
 * such as different illustration, full-art frame, signature, or stamp. Each
 * canonical card has one explicit simple/free art. Review new printing images
 * and add them here; runtime eligibility never infers from set names or images.
 */
export type CyberpunkArtCategory = "standard" | "full-art" | "alternate" | "signature" | "stamp";

export interface CyberpunkCanonicalArtwork {
  readonly freeArtId: string;
  readonly artworks: readonly {
    readonly artId: string;
    readonly category: CyberpunkArtCategory;
    readonly reason: string;
    readonly printingIds: readonly string[];
  }[];
}

export const cyberpunkArtworkManifest = {
  "lucyna-kushinada": {
    freeArtId: "14dc2e38-a373-4b25-be12-e74b1f79e3b2",
    artworks: [
      {
        artId: "14dc2e38-a373-4b25-be12-e74b1f79e3b2",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: ["14dc2e38-a373-4b25-be12-e74b1f79e3b2"],
      },
    ],
  },
  "rebecca-having-a-moment": {
    freeArtId: "71a35836-e604-4d98-ab56-58bfb4581033",
    artworks: [
      {
        artId: "71a35836-e604-4d98-ab56-58bfb4581033",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: ["71a35836-e604-4d98-ab56-58bfb4581033"],
      },
      {
        artId: "f625d2ac-3007-48f4-82b3-b521fc11a172",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["f625d2ac-3007-48f4-82b3-b521fc11a172"],
      },
    ],
  },
  "jackie-welles-pour-one-out-for-me": {
    freeArtId: "a33d3324-fe48-4a9f-80a8-8545a0a4727f",
    artworks: [
      {
        artId: "a33d3324-fe48-4a9f-80a8-8545a0a4727f",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "a33d3324-fe48-4a9f-80a8-8545a0a4727f",
          "a0ef9536-ad3b-47f6-8c2a-171aa3b8b181",
          "762951bd-7bcf-42cd-a44e-b5b127cf00d2",
        ],
      },
      {
        artId: "e4e17d32-3ec4-4c74-927c-fd0911b86e72",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: [
          "e4e17d32-3ec4-4c74-927c-fd0911b86e72",
          "328cd3e4-4177-4d6a-86c0-00d1a5a12b38",
        ],
      },
      {
        artId: "3f37a0e1-e31f-4c6b-b97e-bec9f929432c",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["3f37a0e1-e31f-4c6b-b97e-bec9f929432c"],
      },
    ],
  },
  "v-corporate-exile": {
    freeArtId: "4a5591f9-743e-4186-8deb-560971bb3f82",
    artworks: [
      {
        artId: "4a5591f9-743e-4186-8deb-560971bb3f82",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "4a5591f9-743e-4186-8deb-560971bb3f82",
          "a6511c82-3a16-41b3-a39a-5194897c8648",
          "20bd1c78-1773-486e-bf45-4075fd4f2a3f",
        ],
      },
      {
        artId: "f509ebd8-c8b7-4a22-8922-2d71c6df0b6f",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: [
          "f509ebd8-c8b7-4a22-8922-2d71c6df0b6f",
          "e44580df-d78d-4b09-bb53-edb1ee32ac96",
        ],
      },
      {
        artId: "848e3de6-3a3e-462e-8186-0a214ff03b79",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["848e3de6-3a3e-462e-8186-0a214ff03b79"],
      },
    ],
  },
  "viktor-vektor-sit-down-and-relax": {
    freeArtId: "7d539173-4022-402e-a9f4-100338935fd2",
    artworks: [
      {
        artId: "7d539173-4022-402e-a9f4-100338935fd2",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "7d539173-4022-402e-a9f4-100338935fd2",
          "56a13bb3-7e1d-4846-ac79-9163f33c0143",
          "2344e8d6-3aed-415b-ab6e-f1d634b5ba18",
        ],
      },
      {
        artId: "c9ceb0e7-c803-45d1-8da1-8c85c3b2e7e8",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: [
          "c9ceb0e7-c803-45d1-8da1-8c85c3b2e7e8",
          "a33c6299-f1ee-404e-9197-cad5f7e84fce",
        ],
      },
      {
        artId: "23b81de3-abe3-4231-8dc3-7656de9d99db",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["23b81de3-abe3-4231-8dc3-7656de9d99db"],
      },
    ],
  },
  "goro-takemura-hands-unclean": {
    freeArtId: "2ba68619-7050-44c5-b0ce-b32d48b8f40f",
    artworks: [
      {
        artId: "2ba68619-7050-44c5-b0ce-b32d48b8f40f",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "2ba68619-7050-44c5-b0ce-b32d48b8f40f",
          "25b09451-8cc8-4581-898d-3b5ee6ff6b14",
          "fd889659-8291-41fd-9197-9cdf7cbf6810",
        ],
      },
      {
        artId: "1b6e44dd-d6e7-46eb-a5e5-24c38eed888b",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: [
          "1b6e44dd-d6e7-46eb-a5e5-24c38eed888b",
          "15430373-fafd-479c-84d4-5737c71d0850",
        ],
      },
      {
        artId: "8bdba66b-a20e-49f3-8e85-2e3d7e0c6a37",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["8bdba66b-a20e-49f3-8e85-2e3d7e0c6a37"],
      },
    ],
  },
  "saburo-arasaka-stubborn-patriarch": {
    freeArtId: "6ac7adce-01af-4b5b-956b-698eda0bed14",
    artworks: [
      {
        artId: "6ac7adce-01af-4b5b-956b-698eda0bed14",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "6ac7adce-01af-4b5b-956b-698eda0bed14",
          "54136fbd-ce97-4d23-a8e8-f876e3e64819",
          "13ba5cd2-5000-4cf8-bcfc-6f1b8afe44ca",
        ],
      },
      {
        artId: "77e482f2-6090-47e9-9d03-be28417cb1cb",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: [
          "77e482f2-6090-47e9-9d03-be28417cb1cb",
          "0cb4ae83-a7ca-4ca6-9c83-6c0581baae57",
        ],
      },
      {
        artId: "46387af0-342b-40c7-82fa-858d08ea473f",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["46387af0-342b-40c7-82fa-858d08ea473f"],
      },
    ],
  },
  "yorinobu-arasaka-embracing-destruction": {
    freeArtId: "f70b75b5-aa2f-4c2d-b8c3-01fcb2a670ec",
    artworks: [
      {
        artId: "f70b75b5-aa2f-4c2d-b8c3-01fcb2a670ec",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "f70b75b5-aa2f-4c2d-b8c3-01fcb2a670ec",
          "362bef23-c935-4729-a13b-dc3bc646d9b3",
          "aaad5db8-fcd4-42f0-8ced-e7527dbccf79",
        ],
      },
      {
        artId: "dc7bb3cf-1005-4584-ad7a-447f0ccf07bf",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: [
          "dc7bb3cf-1005-4584-ad7a-447f0ccf07bf",
          "12337d92-713c-4c7c-8a16-595a7b4717f1",
        ],
      },
      {
        artId: "ba15a39b-fc76-474b-a2f0-76e5069a69e4",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["ba15a39b-fc76-474b-a2f0-76e5069a69e4"],
      },
    ],
  },
  "adam-smasher-ender-of-legends": {
    freeArtId: "a9c1137e-2e33-4293-9dcc-9351c9a0bbee",
    artworks: [
      {
        artId: "a9c1137e-2e33-4293-9dcc-9351c9a0bbee",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "a9c1137e-2e33-4293-9dcc-9351c9a0bbee",
          "4d75c13e-bde2-409b-8bcc-516e054f28f5",
        ],
      },
      {
        artId: "74c794ed-2ca7-4318-bcdd-8e3fe5a11f4e",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["74c794ed-2ca7-4318-bcdd-8e3fe5a11f4e"],
      },
      {
        artId: "10ca370b-deb7-4c58-a9f9-faf4f9708f6d",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["10ca370b-deb7-4c58-a9f9-faf4f9708f6d"],
      },
      {
        artId: "aedbd6fe-19d2-4185-b708-b6393e21da20",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["aedbd6fe-19d2-4185-b708-b6393e21da20"],
      },
    ],
  },
  "alt-cunningham-soulkiller-architect": {
    freeArtId: "cb23a651-dd1d-48f8-aca3-8d33fef79fdd",
    artworks: [
      {
        artId: "cb23a651-dd1d-48f8-aca3-8d33fef79fdd",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "cb23a651-dd1d-48f8-aca3-8d33fef79fdd",
          "873656f0-c32a-46fb-856f-8a5ee44b8d21",
        ],
      },
      {
        artId: "1d4ce13a-20de-4f4f-8145-0c8e9892f52c",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["1d4ce13a-20de-4f4f-8145-0c8e9892f52c"],
      },
      {
        artId: "7a6a5336-2b6c-4d8a-b1f0-595a787255ce",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["7a6a5336-2b6c-4d8a-b1f0-595a787255ce"],
      },
      {
        artId: "32d12432-acad-4a11-b8eb-1dd8fb2297f3",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["32d12432-acad-4a11-b8eb-1dd8fb2297f3"],
      },
      {
        artId: "72a627db-f8a0-4559-9194-2b9e4ceca30c",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["72a627db-f8a0-4559-9194-2b9e4ceca30c"],
      },
    ],
  },
  "dexter-deshawn-off-the-grid": {
    freeArtId: "9a298f42-3a9f-4510-b2fd-9cf1b34ade27",
    artworks: [
      {
        artId: "9a298f42-3a9f-4510-b2fd-9cf1b34ade27",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "9a298f42-3a9f-4510-b2fd-9cf1b34ade27",
          "f4ff466c-22ad-4c50-9f4c-29933e51f739",
        ],
      },
      {
        artId: "9d04877f-050d-485d-9447-1bef7ee6ed40",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["9d04877f-050d-485d-9447-1bef7ee6ed40"],
      },
      {
        artId: "57e9c376-6cc1-4f05-9b8f-0b161b5c635a",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["57e9c376-6cc1-4f05-9b8f-0b161b5c635a"],
      },
      {
        artId: "167ad190-3e97-44bf-bda9-5272774d4025",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["167ad190-3e97-44bf-bda9-5272774d4025"],
      },
      {
        artId: "b7ae9f99-d205-4330-b90d-c7d89313274a",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["b7ae9f99-d205-4330-b90d-c7d89313274a"],
      },
      {
        artId: "a2f65b15-6ff1-4214-bd89-11685ef9817f",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["a2f65b15-6ff1-4214-bd89-11685ef9817f"],
      },
    ],
  },
  "dum-dum-maelstrom-triggerman": {
    freeArtId: "aaac486c-dbfd-4137-b373-24a2df29522c",
    artworks: [
      {
        artId: "aaac486c-dbfd-4137-b373-24a2df29522c",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "aaac486c-dbfd-4137-b373-24a2df29522c",
          "33cfbdb0-a169-458a-86dc-9123697654d7",
        ],
      },
      {
        artId: "b3b78f89-424e-41b6-9fa9-aea256568dcc",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["b3b78f89-424e-41b6-9fa9-aea256568dcc"],
      },
      {
        artId: "c44fbb15-edf6-466c-95d4-2e718fb100e5",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["c44fbb15-edf6-466c-95d4-2e718fb100e5"],
      },
    ],
  },
  "evelyn-parker-beautiful-enigma": {
    freeArtId: "ba766c1d-d929-4a22-bc91-7400784536c8",
    artworks: [
      {
        artId: "ba766c1d-d929-4a22-bc91-7400784536c8",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "ba766c1d-d929-4a22-bc91-7400784536c8",
          "080b22ac-9c3d-48ee-ad4f-4e9579f22adc",
        ],
      },
      {
        artId: "56628f3e-fb9d-4e9f-a525-360b08118cfd",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["56628f3e-fb9d-4e9f-a525-360b08118cfd"],
      },
      {
        artId: "22fe9365-6f33-4aeb-b3a4-a78ab563cbe9",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["22fe9365-6f33-4aeb-b3a4-a78ab563cbe9"],
      },
      {
        artId: "989f714b-ed40-44c2-9f4b-819f011bc533",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["989f714b-ed40-44c2-9f4b-819f011bc533"],
      },
    ],
  },
  "goro-takemura-vengeful-bodyguard": {
    freeArtId: "0f6e52f0-511f-4ae9-a380-5e718b26e58a",
    artworks: [
      {
        artId: "0f6e52f0-511f-4ae9-a380-5e718b26e58a",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "0f6e52f0-511f-4ae9-a380-5e718b26e58a",
          "5f3c905b-0834-46a2-be33-ea46e59d4c7f",
        ],
      },
      {
        artId: "af82881d-9e19-46b3-a723-a2ef224687d8",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["af82881d-9e19-46b3-a723-a2ef224687d8"],
      },
      {
        artId: "ff7b01fc-d9fd-4ae7-b141-01f514dee280",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["ff7b01fc-d9fd-4ae7-b141-01f514dee280"],
      },
    ],
  },
  "hanako-arasaka-daughter-of-the-emperor": {
    freeArtId: "2c4a77e8-0fda-4ec1-9519-1d15e0f172b3",
    artworks: [
      {
        artId: "2c4a77e8-0fda-4ec1-9519-1d15e0f172b3",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "2c4a77e8-0fda-4ec1-9519-1d15e0f172b3",
          "1435b785-967e-48a7-8ef7-f7fecbb27aaf",
        ],
      },
      {
        artId: "cc3ed2c4-6e6d-47aa-b358-152c56b24bad",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["cc3ed2c4-6e6d-47aa-b358-152c56b24bad"],
      },
    ],
  },
  "jackie-welles-mama-s-favorite": {
    freeArtId: "9f61ebda-53fd-4b23-8383-d0e0bd32b847",
    artworks: [
      {
        artId: "9f61ebda-53fd-4b23-8383-d0e0bd32b847",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "9f61ebda-53fd-4b23-8383-d0e0bd32b847",
          "c1f9ae1a-841f-431f-919a-429de14be070",
        ],
      },
      {
        artId: "60a2f877-f004-43c0-a7a8-9e54258caf31",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["60a2f877-f004-43c0-a7a8-9e54258caf31"],
      },
      {
        artId: "aadd8dc4-bb37-4901-8200-39b8904268a8",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["aadd8dc4-bb37-4901-8200-39b8904268a8"],
      },
      {
        artId: "5620aa1a-94e9-43c4-b89e-fea304e4257c",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["5620aa1a-94e9-43c4-b89e-fea304e4257c"],
      },
      {
        artId: "eb5b20c4-da57-4e36-b45f-330ac15eb6c0",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["eb5b20c4-da57-4e36-b45f-330ac15eb6c0"],
      },
    ],
  },
  "johnny-silverhand-rocking-renegade": {
    freeArtId: "a8a7d286-0c66-4f01-aca7-45570474d9e4",
    artworks: [
      {
        artId: "a8a7d286-0c66-4f01-aca7-45570474d9e4",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "a8a7d286-0c66-4f01-aca7-45570474d9e4",
          "1159e69c-614f-4a8e-be76-d69ee734bd22",
        ],
      },
      {
        artId: "4f8fbab4-7aad-4271-8dd6-8cdf68654c5e",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["4f8fbab4-7aad-4271-8dd6-8cdf68654c5e"],
      },
    ],
  },
  "judy-alvarez-braindance-maestro": {
    freeArtId: "8d0ad645-ac9a-4ecb-93d0-4c2061a4c477",
    artworks: [
      {
        artId: "8d0ad645-ac9a-4ecb-93d0-4c2061a4c477",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "8d0ad645-ac9a-4ecb-93d0-4c2061a4c477",
          "d74468ab-6024-4ae6-b69a-ac41f6e9cfce",
        ],
      },
      {
        artId: "0324e335-2f17-496c-9789-59f93ed6d31e",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["0324e335-2f17-496c-9789-59f93ed6d31e"],
      },
      {
        artId: "e902c6ed-7f60-42e1-b3e1-e3804181222f",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["e902c6ed-7f60-42e1-b3e1-e3804181222f"],
      },
      {
        artId: "ffef2e56-444f-4b37-83a1-10a1a4be38fb",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["ffef2e56-444f-4b37-83a1-10a1a4be38fb"],
      },
      {
        artId: "acdef65d-d889-4321-9b97-961a4b05d481",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["acdef65d-d889-4321-9b97-961a4b05d481"],
      },
      {
        artId: "2de969bb-8353-46c5-b0ea-09d4378fcaae",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["2de969bb-8353-46c5-b0ea-09d4378fcaae"],
      },
      {
        artId: "a920bb39-b0e6-4d5e-a8e9-eca50d3dce10",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["a920bb39-b0e6-4d5e-a8e9-eca50d3dce10"],
      },
    ],
  },
  "kerry-eurodyne-axe-attitude-audience": {
    freeArtId: "e54e06c0-3f9c-412a-8dea-942eebecd687",
    artworks: [
      {
        artId: "e54e06c0-3f9c-412a-8dea-942eebecd687",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "e54e06c0-3f9c-412a-8dea-942eebecd687",
          "0557c333-1700-439d-bb85-dfec8d578ded",
        ],
      },
      {
        artId: "5ade304e-8e0e-4484-944a-18d8d08caf9f",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["5ade304e-8e0e-4484-944a-18d8d08caf9f"],
      },
    ],
  },
  "muamar-reyes-el-capitan": {
    freeArtId: "dbbf4a6c-340d-4356-81ad-776940a7ee32",
    artworks: [
      {
        artId: "dbbf4a6c-340d-4356-81ad-776940a7ee32",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "dbbf4a6c-340d-4356-81ad-776940a7ee32",
          "3d1e6590-5cdc-4605-8b61-915f21f5514d",
        ],
      },
      {
        artId: "2e06439f-fab6-4a65-a1fc-e5f4afc84eb0",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["2e06439f-fab6-4a65-a1fc-e5f4afc84eb0"],
      },
      {
        artId: "8ed5d5d5-92b6-4f25-b7aa-fa9bee7948d6",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["8ed5d5d5-92b6-4f25-b7aa-fa9bee7948d6"],
      },
      {
        artId: "b2240e25-e4ff-4992-9455-8a56bdbbcdb8",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["b2240e25-e4ff-4992-9455-8a56bdbbcdb8"],
      },
      {
        artId: "4399e640-6e66-4c0b-b0f5-bb68d26e0e3f",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["4399e640-6e66-4c0b-b0f5-bb68d26e0e3f"],
      },
      {
        artId: "f83303e6-72c1-4305-90be-7e4ef6b480f1",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["f83303e6-72c1-4305-90be-7e4ef6b480f1"],
      },
    ],
  },
  "padre-man-of-the-cross": {
    freeArtId: "c7f0583f-2493-4e1f-9967-977bc0c6fa15",
    artworks: [
      {
        artId: "c7f0583f-2493-4e1f-9967-977bc0c6fa15",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "c7f0583f-2493-4e1f-9967-977bc0c6fa15",
          "e1f5dc01-9e96-4102-af3f-07ad31f5db15",
        ],
      },
      {
        artId: "abd75b6c-0205-4909-a990-237b4bed70e5",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["abd75b6c-0205-4909-a990-237b4bed70e5"],
      },
    ],
  },
  "panam-palmer-nomad-cavalry": {
    freeArtId: "6e4ee31b-82d1-421c-b658-ba3f79520365",
    artworks: [
      {
        artId: "6e4ee31b-82d1-421c-b658-ba3f79520365",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "6e4ee31b-82d1-421c-b658-ba3f79520365",
          "2cfe57a5-cafe-4611-90fd-c72f33250933",
        ],
      },
      {
        artId: "20c0d91e-76d5-4904-82e8-53907537aee3",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["20c0d91e-76d5-4904-82e8-53907537aee3"],
      },
      {
        artId: "c7c6c4fa-eb19-43d6-904c-129cf062a8aa",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["c7c6c4fa-eb19-43d6-904c-129cf062a8aa"],
      },
    ],
  },
  "river-ward-detective-on-the-hunt": {
    freeArtId: "b3895f75-e147-49b0-a6d8-6fb35b356b2e",
    artworks: [
      {
        artId: "b3895f75-e147-49b0-a6d8-6fb35b356b2e",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "b3895f75-e147-49b0-a6d8-6fb35b356b2e",
          "b217ae88-52a6-44b3-b021-964db4534dbd",
        ],
      },
      {
        artId: "ef33c0b9-0e13-438e-952b-5d834485b0aa",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["ef33c0b9-0e13-438e-952b-5d834485b0aa"],
      },
      {
        artId: "e59b67b3-a388-4228-94a3-84ee12e68937",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["e59b67b3-a388-4228-94a3-84ee12e68937"],
      },
      {
        artId: "f6e85d48-0d0b-4cfa-9cdf-1b66f8104328",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["f6e85d48-0d0b-4cfa-9cdf-1b66f8104328"],
      },
      {
        artId: "6545a2e6-9de1-419e-964c-a55d07f9e34d",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["6545a2e6-9de1-419e-964c-a55d07f9e34d"],
      },
    ],
  },
  "rogue-amendiares-preem-solo": {
    freeArtId: "2dd7547d-5098-4082-a98b-f39a583a222f",
    artworks: [
      {
        artId: "2dd7547d-5098-4082-a98b-f39a583a222f",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "2dd7547d-5098-4082-a98b-f39a583a222f",
          "dd2f97c2-5ea6-4564-8b39-4f21ad0a7885",
        ],
      },
      {
        artId: "6b75ec33-da55-46c7-a88c-f0fb89263253",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["6b75ec33-da55-46c7-a88c-f0fb89263253"],
      },
      {
        artId: "254975e9-0381-4a1c-96c7-19186a855e48",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["254975e9-0381-4a1c-96c7-19186a855e48"],
      },
    ],
  },
  "royce-psycho-on-the-edge": {
    freeArtId: "3e2e228b-dbfb-484b-b82d-6972ff184aab",
    artworks: [
      {
        artId: "3e2e228b-dbfb-484b-b82d-6972ff184aab",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "3e2e228b-dbfb-484b-b82d-6972ff184aab",
          "0e4966a2-e5cf-4acd-905a-750e9c4cefff",
        ],
      },
      {
        artId: "181a18f4-f6ba-4b23-bc56-ca43bd7d0843",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["181a18f4-f6ba-4b23-bc56-ca43bd7d0843"],
      },
      {
        artId: "f712b214-b109-4e69-bc74-4991905024f7",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["f712b214-b109-4e69-bc74-4991905024f7"],
      },
      {
        artId: "cbbe5954-ce33-47aa-83c1-bdda4c7b907f",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["cbbe5954-ce33-47aa-83c1-bdda4c7b907f"],
      },
      {
        artId: "e59f737b-83e1-45f2-a469-8bde0146b967",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["e59f737b-83e1-45f2-a469-8bde0146b967"],
      },
    ],
  },
  "sasha-yakovleva-won-t-let-you-down": {
    freeArtId: "2647f881-5a7e-4ffb-b231-6574dc531f43",
    artworks: [
      {
        artId: "2647f881-5a7e-4ffb-b231-6574dc531f43",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "2647f881-5a7e-4ffb-b231-6574dc531f43",
          "fa80313c-9aeb-4ae8-ad81-35b3f45fcbfe",
        ],
      },
      {
        artId: "146d6391-3b35-4e74-b270-cef69d8f2a91",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["146d6391-3b35-4e74-b270-cef69d8f2a91"],
      },
    ],
  },
  "v-streetkid": {
    freeArtId: "3fc63c58-5954-4744-a5af-047bfc5cb159",
    artworks: [
      {
        artId: "3fc63c58-5954-4744-a5af-047bfc5cb159",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "3fc63c58-5954-4744-a5af-047bfc5cb159",
          "79119e83-b50b-4a79-8a6c-f496d9ed7ef6",
        ],
      },
      {
        artId: "c2d0e2a7-470f-4498-b6d5-5df1e3ecc3ef",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: [
          "c2d0e2a7-470f-4498-b6d5-5df1e3ecc3ef",
          "e6dbfd52-85c5-4fd4-a77c-ca829e827d8a",
        ],
      },
      {
        artId: "20debd66-ff1c-42c3-9869-928cba33ccb5",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["20debd66-ff1c-42c3-9869-928cba33ccb5"],
      },
      {
        artId: "ce137eea-c335-4f03-81f0-4717b75d5ce7",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["ce137eea-c335-4f03-81f0-4717b75d5ce7"],
      },
      {
        artId: "0f082a95-b3e2-4563-be0b-88b5d85d6138",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["0f082a95-b3e2-4563-be0b-88b5d85d6138"],
      },
      {
        artId: "248f408c-437b-48df-8410-b7419e2f54d2",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["248f408c-437b-48df-8410-b7419e2f54d2"],
      },
      {
        artId: "ccbdc832-812d-4b93-abd2-c2a5ba1684d2",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["ccbdc832-812d-4b93-abd2-c2a5ba1684d2"],
      },
    ],
  },
  "wakako-okada-peace-and-harmony": {
    freeArtId: "8f7a7d0b-5935-4732-a9ba-76b19467d5a0",
    artworks: [
      {
        artId: "8f7a7d0b-5935-4732-a9ba-76b19467d5a0",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "8f7a7d0b-5935-4732-a9ba-76b19467d5a0",
          "33ee09a3-4591-4302-9052-6dd5130861c6",
        ],
      },
      {
        artId: "16e04a94-086a-4c20-b788-88ac016ec59b",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["16e04a94-086a-4c20-b788-88ac016ec59b"],
      },
    ],
  },
  "dexter-deshawn-one-last-chance": {
    freeArtId: "e2f38541-ecc9-41dc-ae15-164171391bff",
    artworks: [
      {
        artId: "e2f38541-ecc9-41dc-ae15-164171391bff",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "e2f38541-ecc9-41dc-ae15-164171391bff",
          "f9c512f2-a41f-4114-9500-cee3f8d8cc35",
          "daabe14b-dc95-413f-b91a-d3e32937bfd2",
        ],
      },
    ],
  },
  "mt0d12-flathead": {
    freeArtId: "5f0d9dac-2547-4ecb-896e-0c603968422a",
    artworks: [
      {
        artId: "5f0d9dac-2547-4ecb-896e-0c603968422a",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "5f0d9dac-2547-4ecb-896e-0c603968422a",
          "d4a627d7-2ea9-4080-9f54-435a7d77fb27",
          "f7742fc7-0abe-45ee-a6ce-22caf159e06d",
        ],
      },
    ],
  },
  "goro-takemura-losing-his-way": {
    freeArtId: "42e03e7a-923d-4f2b-8d79-191e69873947",
    artworks: [
      {
        artId: "42e03e7a-923d-4f2b-8d79-191e69873947",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "42e03e7a-923d-4f2b-8d79-191e69873947",
          "fb45ca8c-cb8a-4de9-8cf4-04a697c3fdfd",
          "384b716d-fe9c-4a09-86b3-fe9b25928c51",
        ],
      },
    ],
  },
  minotaur: {
    freeArtId: "19587d4f-6d47-44fe-b4da-99743e2742f7",
    artworks: [
      {
        artId: "19587d4f-6d47-44fe-b4da-99743e2742f7",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "19587d4f-6d47-44fe-b4da-99743e2742f7",
          "a8dd2d7b-88b8-4b15-b4dd-e3aa3757bb25",
          "6e023192-0834-4d6f-935a-e5d6d4d6eff0",
        ],
      },
      {
        artId: "a4271ab1-4688-4f98-b000-a186aadd7fee",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["a4271ab1-4688-4f98-b000-a186aadd7fee"],
      },
      {
        artId: "bd6fe2cf-bfcd-4de2-bc78-ffc215d39603",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["bd6fe2cf-bfcd-4de2-bc78-ffc215d39603"],
      },
    ],
  },
  "6th-street-recruits": {
    freeArtId: "756f3e53-9ff3-4c01-9f33-bb27a1cd5957",
    artworks: [
      {
        artId: "756f3e53-9ff3-4c01-9f33-bb27a1cd5957",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "756f3e53-9ff3-4c01-9f33-bb27a1cd5957",
          "14e20948-a74b-4a27-a156-d34d8cfb98cc",
        ],
      },
    ],
  },
  "adam-smasher-metal-over-meat": {
    freeArtId: "d23e322f-ad60-431d-b33e-1e8a813248ff",
    artworks: [
      {
        artId: "d23e322f-ad60-431d-b33e-1e8a813248ff",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "d23e322f-ad60-431d-b33e-1e8a813248ff",
          "fdb7a7c3-350e-49ea-8a9e-8477ce6c657a",
        ],
      },
      {
        artId: "726b13d2-0d74-42db-a5e9-b8b852224a16",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["726b13d2-0d74-42db-a5e9-b8b852224a16"],
      },
      {
        artId: "59d1ce5c-d616-45d5-9816-576f5f1509f3",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["59d1ce5c-d616-45d5-9816-576f5f1509f3"],
      },
      {
        artId: "2a0fa3c6-f259-49ad-88a2-843713712ccd",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["2a0fa3c6-f259-49ad-88a2-843713712ccd"],
      },
      {
        artId: "b2d8aa5e-0d41-4c9e-b736-9d61e8153651",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["b2d8aa5e-0d41-4c9e-b736-9d61e8153651"],
      },
    ],
  },
  "alt-cunningham-mother-of-daemons": {
    freeArtId: "e782dd02-a136-4bf8-b04b-328c65b84f19",
    artworks: [
      {
        artId: "e782dd02-a136-4bf8-b04b-328c65b84f19",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "e782dd02-a136-4bf8-b04b-328c65b84f19",
          "3d3e0e55-fa7a-40ba-bf30-0204cca88612",
        ],
      },
      {
        artId: "2e2c4d9d-516d-4fb2-a6ba-bee8dede71d3",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["2e2c4d9d-516d-4fb2-a6ba-bee8dede71d3"],
      },
    ],
  },
  "animals-wrecker": {
    freeArtId: "7514dd38-6e2d-43dd-9715-6b3a32615382",
    artworks: [
      {
        artId: "7514dd38-6e2d-43dd-9715-6b3a32615382",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "7514dd38-6e2d-43dd-9715-6b3a32615382",
          "81364914-7121-43fc-9610-f2f9736866d1",
        ],
      },
    ],
  },
  "augmented-negotiators": {
    freeArtId: "a195323a-e29e-4c05-8e6c-7f1638c8264c",
    artworks: [
      {
        artId: "a195323a-e29e-4c05-8e6c-7f1638c8264c",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "a195323a-e29e-4c05-8e6c-7f1638c8264c",
          "28973c43-529c-487e-aa05-ac99280d66c3",
        ],
      },
    ],
  },
  "caliber-totentanz-s-top-dog": {
    freeArtId: "4b5dc479-0db1-46dd-859f-e7dc34d50f03",
    artworks: [
      {
        artId: "4b5dc479-0db1-46dd-859f-e7dc34d50f03",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "4b5dc479-0db1-46dd-859f-e7dc34d50f03",
          "20cd09ad-b0c6-4ffe-9036-04ff24d8fe59",
        ],
      },
    ],
  },
  "chrome-fang": {
    freeArtId: "40db55a6-0220-4cb9-8854-0e23f7cb91f8",
    artworks: [
      {
        artId: "40db55a6-0220-4cb9-8854-0e23f7cb91f8",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "40db55a6-0220-4cb9-8854-0e23f7cb91f8",
          "d6dd0114-fdd5-452a-b752-3e58a2e137f5",
          "0aab2858-fa5e-42f6-997e-39797fefb669",
          "1e80ecfb-a3f2-421d-ac71-c05547366fb6",
        ],
      },
    ],
  },
  "corpo-security": {
    freeArtId: "80dcc139-d31d-4b89-86ff-cdbdd2664953",
    artworks: [
      {
        artId: "80dcc139-d31d-4b89-86ff-cdbdd2664953",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "80dcc139-d31d-4b89-86ff-cdbdd2664953",
          "19737e35-546d-406f-af5f-2fe6865cdd93",
          "0ce87466-8869-484f-bd4c-5094fdfc6dbc",
          "07cad5ea-45c4-404b-99b8-8f53c280a4fb",
          "c165a5eb-3338-4a80-8fb9-b7e39b412e5b",
        ],
      },
      {
        artId: "6b574386-2893-4236-86a4-68c48222ae9e",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["6b574386-2893-4236-86a4-68c48222ae9e"],
      },
      {
        artId: "8c0cd775-71b6-43f9-af49-1d41386eb1ee",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["8c0cd775-71b6-43f9-af49-1d41386eb1ee"],
      },
    ],
  },
  "delamain-cab": {
    freeArtId: "5b9cdefa-29f4-4a3a-a426-eea46302ef60",
    artworks: [
      {
        artId: "5b9cdefa-29f4-4a3a-a426-eea46302ef60",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "5b9cdefa-29f4-4a3a-a426-eea46302ef60",
          "cddf9659-8ba5-4718-827f-5a6518e7df83",
          "8092ff00-bff0-4a33-98e1-1fa33adabb8d",
          "a6bc4a11-ed78-49dc-999b-68b7fe50aefd",
          "e15c07b6-f563-4825-aad4-6b3068c1ab85",
        ],
      },
      {
        artId: "e03952c1-9f8c-4ecb-8258-ab753ef9c9a7",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["e03952c1-9f8c-4ecb-8258-ab753ef9c9a7"],
      },
      {
        artId: "1f3e50a4-54ea-4e77-9ef3-0ceeb38d0278",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["1f3e50a4-54ea-4e77-9ef3-0ceeb38d0278"],
      },
    ],
  },
  "delamain-rideshare-ai": {
    freeArtId: "c7eba3a0-63cb-4311-988e-d487a7c0841a",
    artworks: [
      {
        artId: "c7eba3a0-63cb-4311-988e-d487a7c0841a",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "c7eba3a0-63cb-4311-988e-d487a7c0841a",
          "32f8d89a-1e4b-46b8-9323-77c297c5b5ae",
        ],
      },
    ],
  },
  "el-sombreron-la-venganza-lenta": {
    freeArtId: "94180516-28a6-4f5c-b79e-de38a95ed47b",
    artworks: [
      {
        artId: "94180516-28a6-4f5c-b79e-de38a95ed47b",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "94180516-28a6-4f5c-b79e-de38a95ed47b",
          "c180e174-f1b6-4b9c-b2c8-db0551ae49d2",
        ],
      },
    ],
  },
  "emergency-atlus": {
    freeArtId: "9c18b6ae-765d-4244-8de4-e382c4767de1",
    artworks: [
      {
        artId: "9c18b6ae-765d-4244-8de4-e382c4767de1",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "9c18b6ae-765d-4244-8de4-e382c4767de1",
          "b4a1d2af-4ee4-4ec4-8a5b-eaec9cb3211a",
          "b00202eb-35e5-4ae7-8079-34b70a143040",
          "0a5892de-42fa-4001-b48a-2c294251dad8",
          "45dd3b11-7bd8-4239-a404-ab0c9b24fcdb",
        ],
      },
    ],
  },
  "evelyn-parker-scheming-siren": {
    freeArtId: "7d174619-2183-4058-a89a-082c6b7b5a5c",
    artworks: [
      {
        artId: "7d174619-2183-4058-a89a-082c6b7b5a5c",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "7d174619-2183-4058-a89a-082c6b7b5a5c",
          "c40f0461-c757-4e09-94cc-27ed31f08dd7",
          "4b037f20-0cb8-4dfa-bd34-3a3b8381632b",
          "c7bc2b37-c1a4-43aa-a4c3-5dd60514b098",
          "3757f0f3-32d0-41c2-89dc-515271d2b758",
        ],
      },
    ],
  },
  "field-operator": {
    freeArtId: "876dfa5c-6df4-4930-b284-f2c466e6b90c",
    artworks: [
      {
        artId: "876dfa5c-6df4-4930-b284-f2c466e6b90c",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "876dfa5c-6df4-4930-b284-f2c466e6b90c",
          "62d99053-43eb-4eba-9bf4-9d7c298d03ab",
          "377a3054-68e1-4843-8109-70e230592519",
          "34d2a24a-7976-4178-9f9e-b819f15a6a34",
          "45ae40b9-f0f3-4fd9-901a-cd1bed292133",
        ],
      },
      {
        artId: "398de6dd-f801-45ca-a183-17de617cf973",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["398de6dd-f801-45ca-a183-17de617cf973"],
      },
    ],
  },
  "gilded-maton": {
    freeArtId: "846b55b4-5e12-44b6-a204-53bd8c862888",
    artworks: [
      {
        artId: "846b55b4-5e12-44b6-a204-53bd8c862888",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "846b55b4-5e12-44b6-a204-53bd8c862888",
          "cbbcb49e-6c6f-436c-91cf-e9716f6a30af",
        ],
      },
    ],
  },
  "hacked-corpo": {
    freeArtId: "7dc71978-0995-4b93-9ba3-83d1118c3c4b",
    artworks: [
      {
        artId: "7dc71978-0995-4b93-9ba3-83d1118c3c4b",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "7dc71978-0995-4b93-9ba3-83d1118c3c4b",
          "a105464f-997f-4f2b-97dd-3a4f461f0a59",
        ],
      },
    ],
  },
  "hanako-arasaka-in-a-gilded-cage": {
    freeArtId: "7386d22f-1065-4043-a6c4-9cee6256fe8a",
    artworks: [
      {
        artId: "7386d22f-1065-4043-a6c4-9cee6256fe8a",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "7386d22f-1065-4043-a6c4-9cee6256fe8a",
          "ab6fab2a-8101-4bc7-8f5d-b55adf09bc4c",
        ],
      },
      {
        artId: "005dfb9e-7bdd-4cc1-ade2-08dd28ed5998",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["005dfb9e-7bdd-4cc1-ade2-08dd28ed5998"],
      },
    ],
  },
  "heywood-ripperdoc": {
    freeArtId: "2fc5ac93-dae5-4af5-a813-77abc0cc8dfd",
    artworks: [
      {
        artId: "2fc5ac93-dae5-4af5-a813-77abc0cc8dfd",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "2fc5ac93-dae5-4af5-a813-77abc0cc8dfd",
          "2a6b5b50-b007-40f4-bbdc-90f6bdc3761a",
          "364ef4ac-8b0c-48b1-8cf2-454477abc452",
          "aebf807a-2fbb-4b60-ae4b-36783314871f",
        ],
      },
    ],
  },
  "jacked-in-voodoo-boy": {
    freeArtId: "8e2f2d0c-0e92-4744-a510-a9c7ac371d81",
    artworks: [
      {
        artId: "8e2f2d0c-0e92-4744-a510-a9c7ac371d81",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "8e2f2d0c-0e92-4744-a510-a9c7ac371d81",
          "f18a73a9-fa29-4351-ad96-8e7c1dd0e8a1",
        ],
      },
    ],
  },
  "jackie-welles-ride-or-die-choom": {
    freeArtId: "12d44604-ad7b-4e82-b517-9edb0be44427",
    artworks: [
      {
        artId: "12d44604-ad7b-4e82-b517-9edb0be44427",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "12d44604-ad7b-4e82-b517-9edb0be44427",
          "93f68b18-e15c-44be-883b-8db7990646f1",
        ],
      },
      {
        artId: "5b855c9c-bdf3-4743-9653-d6eb6ce3f6f5",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["5b855c9c-bdf3-4743-9653-d6eb6ce3f6f5"],
      },
      {
        artId: "adf78727-f462-424c-8689-0b759794ee3c",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["adf78727-f462-424c-8689-0b759794ee3c"],
      },
    ],
  },
  "japantown-jonin": {
    freeArtId: "30619097-d9d7-42fe-bf4c-cd4ae822792d",
    artworks: [
      {
        artId: "30619097-d9d7-42fe-bf4c-cd4ae822792d",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "30619097-d9d7-42fe-bf4c-cd4ae822792d",
          "fa9d3c0c-5634-42a1-a665-9173c045fa30",
        ],
      },
    ],
  },
  "johnny-silverhand-never-stop-fighting": {
    freeArtId: "14ab188f-2ce3-4790-8823-5a352371ff1f",
    artworks: [
      {
        artId: "14ab188f-2ce3-4790-8823-5a352371ff1f",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "14ab188f-2ce3-4790-8823-5a352371ff1f",
          "975957a0-9c72-4a67-8260-f86c1c70bfb5",
        ],
      },
      {
        artId: "7b113940-7325-4304-b07a-61719b47a49c",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["7b113940-7325-4304-b07a-61719b47a49c"],
      },
    ],
  },
  "judy-alvarez-nothing-to-doubt": {
    freeArtId: "dcfe8370-9abf-4395-b50b-efea505609ba",
    artworks: [
      {
        artId: "dcfe8370-9abf-4395-b50b-efea505609ba",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "dcfe8370-9abf-4395-b50b-efea505609ba",
          "98b18e2d-a955-43c7-880c-6233166c673a",
        ],
      },
      {
        artId: "2c0d6f48-0804-4d5f-83c2-f28367ce26d5",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["2c0d6f48-0804-4d5f-83c2-f28367ce26d5"],
      },
    ],
  },
  "kerry-eurodyne-the-last-rockerboy": {
    freeArtId: "c26c7db6-f540-4073-ab33-b09335631764",
    artworks: [
      {
        artId: "c26c7db6-f540-4073-ab33-b09335631764",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "c26c7db6-f540-4073-ab33-b09335631764",
          "1a986e5a-fe97-408c-81e9-b675c64bdcf9",
        ],
      },
      {
        artId: "d2e8c1c2-6cd4-4d2e-94fa-21b96daaea6b",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["d2e8c1c2-6cd4-4d2e-94fa-21b96daaea6b"],
      },
      {
        artId: "c51e7c71-6305-4330-a107-a197af5eeeb2",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["c51e7c71-6305-4330-a107-a197af5eeeb2"],
      },
    ],
  },
  "la-llorona-ghost-of-the-past": {
    freeArtId: "e3d1d8a0-1d53-4c85-84ca-66439fd3639a",
    artworks: [
      {
        artId: "e3d1d8a0-1d53-4c85-84ca-66439fd3639a",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "e3d1d8a0-1d53-4c85-84ca-66439fd3639a",
          "91e553d4-ac26-4135-bcd9-9fc2661d3e90",
        ],
      },
    ],
  },
  "lizzy-wizzy-delicate-weapon": {
    freeArtId: "7072a2d2-ec4f-4575-909e-15a107dfef79",
    artworks: [
      {
        artId: "7072a2d2-ec4f-4575-909e-15a107dfef79",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "7072a2d2-ec4f-4575-909e-15a107dfef79",
          "929b5e98-ab82-4e36-bb72-a00a223ded77",
        ],
      },
    ],
  },
  "maelstrom-goons": {
    freeArtId: "e14bdd12-1214-4104-bfdd-ae023c21527c",
    artworks: [
      {
        artId: "e14bdd12-1214-4104-bfdd-ae023c21527c",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "e14bdd12-1214-4104-bfdd-ae023c21527c",
          "42236397-716c-422c-8868-9f33dd33b089",
        ],
      },
    ],
  },
  "maelstrom-zealots": {
    freeArtId: "43e5568f-a609-4eff-8502-e81ba9134d2c",
    artworks: [
      {
        artId: "43e5568f-a609-4eff-8502-e81ba9134d2c",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "43e5568f-a609-4eff-8502-e81ba9134d2c",
          "ce3770f6-0fa7-41f4-af5f-eacce5846c98",
        ],
      },
    ],
  },
  "maman-brigitte-spirit-of-death": {
    freeArtId: "8a7131eb-e1dd-46d6-84f6-2de315aee975",
    artworks: [
      {
        artId: "8a7131eb-e1dd-46d6-84f6-2de315aee975",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "8a7131eb-e1dd-46d6-84f6-2de315aee975",
          "220bef49-2e98-4bc6-b023-5bb8f492b29b",
        ],
      },
      {
        artId: "a1c75317-6fa9-48f8-b296-cfe6a336f12a",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["a1c75317-6fa9-48f8-b296-cfe6a336f12a"],
      },
      {
        artId: "317331e6-55bd-4c4d-9f50-700601f53db2",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["317331e6-55bd-4c4d-9f50-700601f53db2"],
      },
      {
        artId: "5cc2112c-10b6-4491-963d-8b517244aaee",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["5cc2112c-10b6-4491-963d-8b517244aaee"],
      },
    ],
  },
  "maxtac-av": {
    freeArtId: "f1fa787d-e936-42a8-b42f-14999e722793",
    artworks: [
      {
        artId: "f1fa787d-e936-42a8-b42f-14999e722793",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "f1fa787d-e936-42a8-b42f-14999e722793",
          "27c1bf13-5f6b-4421-aa76-5789a94c9c1b",
          "3b69e0c7-418c-4000-b6f4-f9584bc541e3",
          "5a28466e-e4e1-408d-9d84-2ce48e95d89d",
        ],
      },
    ],
  },
  "maxtac-heavy": {
    freeArtId: "060f0c56-cbb7-45fd-a0cd-9c7b9d0f8103",
    artworks: [
      {
        artId: "060f0c56-cbb7-45fd-a0cd-9c7b9d0f8103",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "060f0c56-cbb7-45fd-a0cd-9c7b9d0f8103",
          "0f60c84e-e84f-49a3-b913-0039d8262371",
        ],
      },
    ],
  },
  "maxtac-squadron": {
    freeArtId: "22b276f4-7cf6-4b14-a220-8368a0839287",
    artworks: [
      {
        artId: "22b276f4-7cf6-4b14-a220-8368a0839287",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "22b276f4-7cf6-4b14-a220-8368a0839287",
          "f52caed9-3415-4027-a448-2c38b045553b",
        ],
      },
      {
        artId: "f77b20fd-8792-41bb-a634-06030fd2eb6d",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["f77b20fd-8792-41bb-a634-06030fd2eb6d"],
      },
      {
        artId: "c89b85cb-aa23-4fa6-b093-aad81bde74a4",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["c89b85cb-aa23-4fa6-b093-aad81bde74a4"],
      },
    ],
  },
  "maxtac-suppression-team": {
    freeArtId: "47f55164-e5da-494e-9d55-02bd0b7f97c1",
    artworks: [
      {
        artId: "47f55164-e5da-494e-9d55-02bd0b7f97c1",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "47f55164-e5da-494e-9d55-02bd0b7f97c1",
          "03849cd8-c3d8-4741-ae9e-d85cd9bb488d",
        ],
      },
    ],
  },
  "meredith-stout-stone-cold-corpo": {
    freeArtId: "5939771d-bdcc-4b42-aea4-376311189e93",
    artworks: [
      {
        artId: "5939771d-bdcc-4b42-aea4-376311189e93",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "5939771d-bdcc-4b42-aea4-376311189e93",
          "96e76b12-4e53-4e2c-aca3-3fedf6f21e18",
        ],
      },
    ],
  },
  "misty-olszewski-mender-of-broken-spirits": {
    freeArtId: "17252514-02ba-4d0d-a9cc-3590cee528af",
    artworks: [
      {
        artId: "17252514-02ba-4d0d-a9cc-3590cee528af",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "17252514-02ba-4d0d-a9cc-3590cee528af",
          "e4a8b8fc-fbc7-41ce-9f89-7538690b9c62",
        ],
      },
      {
        artId: "17517c74-9e61-423a-9d65-c7f4b56af29a",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["17517c74-9e61-423a-9d65-c7f4b56af29a"],
      },
    ],
  },
  "modded-kusanagi": {
    freeArtId: "50e8101a-3d0e-45ea-9444-22007f7f9cb0",
    artworks: [
      {
        artId: "50e8101a-3d0e-45ea-9444-22007f7f9cb0",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "50e8101a-3d0e-45ea-9444-22007f7f9cb0",
          "ee22b73e-8b14-4225-9c86-428cfada892f",
        ],
      },
    ],
  },
  "modded-muramasa": {
    freeArtId: "3bd6767b-ef0c-47dd-9f47-d00112a74111",
    artworks: [
      {
        artId: "3bd6767b-ef0c-47dd-9f47-d00112a74111",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "3bd6767b-ef0c-47dd-9f47-d00112a74111",
          "2b247956-465f-4b39-8091-a95c90bc8b70",
        ],
      },
    ],
  },
  "mox-inciters": {
    freeArtId: "354fd7d3-070d-4767-989c-5b3efbd9f30d",
    artworks: [
      {
        artId: "354fd7d3-070d-4767-989c-5b3efbd9f30d",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "354fd7d3-070d-4767-989c-5b3efbd9f30d",
          "859345fa-c791-49dc-9258-505982b5adea",
        ],
      },
    ],
  },
  "nadia-fighting-through-grief": {
    freeArtId: "4bab255b-763a-4762-b5e2-430316526b8a",
    artworks: [
      {
        artId: "4bab255b-763a-4762-b5e2-430316526b8a",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "4bab255b-763a-4762-b5e2-430316526b8a",
          "8cb7b93c-e281-4d94-a4b0-bb0cb5d0fa16",
        ],
      },
    ],
  },
  octant: {
    freeArtId: "089df0e6-0000-4e6c-b6d3-d9119466b624",
    artworks: [
      {
        artId: "089df0e6-0000-4e6c-b6d3-d9119466b624",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "089df0e6-0000-4e6c-b6d3-d9119466b624",
          "3b8c035e-161d-4a84-bdc8-f76899e8244f",
        ],
      },
    ],
  },
  "offduty-malfini": {
    freeArtId: "fbefb447-34a3-4d53-9b23-d1bf141f8eec",
    artworks: [
      {
        artId: "fbefb447-34a3-4d53-9b23-d1bf141f8eec",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "fbefb447-34a3-4d53-9b23-d1bf141f8eec",
          "37066158-f899-42c6-abd7-4dcd882a75cd",
          "1043d9b7-5dae-4fc5-852d-ec31daaaa88d",
          "e7ef78a6-72d3-42a4-ba98-14facb194eb9",
        ],
      },
    ],
  },
  "pacifica-netrunner": {
    freeArtId: "b43f5006-7388-4189-81ff-343b5428305b",
    artworks: [
      {
        artId: "b43f5006-7388-4189-81ff-343b5428305b",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "b43f5006-7388-4189-81ff-343b5428305b",
          "5131f2e5-fe1b-4a49-b0ba-b85d04c9cd1b",
        ],
      },
    ],
  },
  "panam-palmer-strength-through-family": {
    freeArtId: "9231f9ff-1ba5-4c4f-bd78-70e0780b58e5",
    artworks: [
      {
        artId: "9231f9ff-1ba5-4c4f-bd78-70e0780b58e5",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "9231f9ff-1ba5-4c4f-bd78-70e0780b58e5",
          "544f8db8-02af-44e5-992e-170f51ffca37",
        ],
      },
      {
        artId: "7d71aedf-dbb6-435f-bece-e522834db122",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["7d71aedf-dbb6-435f-bece-e522834db122"],
      },
    ],
  },
  "pepe-najarro-working-doubles": {
    freeArtId: "0de81196-f1d3-4fd0-ae6a-062dae3f3f2c",
    artworks: [
      {
        artId: "0de81196-f1d3-4fd0-ae6a-062dae3f3f2c",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "0de81196-f1d3-4fd0-ae6a-062dae3f3f2c",
          "786d5ce2-bfc0-4648-9c7d-323e939a1d34",
        ],
      },
    ],
  },
  "placide-voodoo-sentinel": {
    freeArtId: "81c55c1f-362e-4ffd-8f9b-4162b298dbd5",
    artworks: [
      {
        artId: "81c55c1f-362e-4ffd-8f9b-4162b298dbd5",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "81c55c1f-362e-4ffd-8f9b-4162b298dbd5",
          "0ff059f8-90c3-47ef-ba3b-cd380f30f14e",
        ],
      },
    ],
  },
  "psycho-squad": {
    freeArtId: "d7e0e2e5-6e22-4b45-9e91-50936773e2e1",
    artworks: [
      {
        artId: "d7e0e2e5-6e22-4b45-9e91-50936773e2e1",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "d7e0e2e5-6e22-4b45-9e91-50936773e2e1",
          "61118bbb-c1f6-4b1d-8d46-4f33f0a135b1",
          "b6295362-bd30-4b91-8755-738938cf839b",
          "e2fe4b47-4d66-4989-bab7-16143f7256ac",
          "c45d93f9-bc2d-4e35-9d77-ba62d9d4e4d9",
        ],
      },
    ],
  },
  "riding-nomad": {
    freeArtId: "1ee3ba07-86b0-4309-be55-4b4698f700b8",
    artworks: [
      {
        artId: "1ee3ba07-86b0-4309-be55-4b4698f700b8",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "1ee3ba07-86b0-4309-be55-4b4698f700b8",
          "29b3036d-306a-485f-af6c-b08fb5b912ac",
        ],
      },
      {
        artId: "4f69c4bd-5b50-4892-a348-1ca16a81f8d6",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["4f69c4bd-5b50-4892-a348-1ca16a81f8d6"],
      },
    ],
  },
  "rita-wheeler-no-stupid-questions": {
    freeArtId: "5d795b32-9ad8-4c94-abd4-d01e389db389",
    artworks: [
      {
        artId: "5d795b32-9ad8-4c94-abd4-d01e389db389",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "5d795b32-9ad8-4c94-abd4-d01e389db389",
          "6b5606c9-12a2-46d6-b13f-a672c6bd5f07",
        ],
      },
    ],
  },
  "rockn-rockerboy": {
    freeArtId: "07aaea5c-5aef-466e-956a-2e68930669c0",
    artworks: [
      {
        artId: "07aaea5c-5aef-466e-956a-2e68930669c0",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "07aaea5c-5aef-466e-956a-2e68930669c0",
          "58cffb40-0914-4c6b-81cf-cdd8b2b83f17",
        ],
      },
    ],
  },
  "rogue-amendiares-queen-of-the-afterlife": {
    freeArtId: "3193a6bd-3e99-4501-9c5c-8d5ea32c779c",
    artworks: [
      {
        artId: "3193a6bd-3e99-4501-9c5c-8d5ea32c779c",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "3193a6bd-3e99-4501-9c5c-8d5ea32c779c",
          "4abedde2-f9db-4451-a2ab-fc7f594ea132",
        ],
      },
      {
        artId: "807c871c-bebe-4343-9b68-1f89af5ed0da",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["807c871c-bebe-4343-9b68-1f89af5ed0da"],
      },
    ],
  },
  "royce-don-t-call-me-simon": {
    freeArtId: "b749ce16-1b44-47d8-bce4-4fd373007a5c",
    artworks: [
      {
        artId: "b749ce16-1b44-47d8-bce4-4fd373007a5c",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "b749ce16-1b44-47d8-bce4-4fd373007a5c",
          "a4276d5e-cdf1-42cb-a6c3-8722d8c7c595",
        ],
      },
      {
        artId: "b3fe1a4f-74da-4882-82a9-14aebd392be4",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["b3fe1a4f-74da-4882-82a9-14aebd392be4"],
      },
    ],
  },
  "ruthless-lowlife": {
    freeArtId: "e1b674d0-4ac7-4523-be19-809308871d49",
    artworks: [
      {
        artId: "e1b674d0-4ac7-4523-be19-809308871d49",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "e1b674d0-4ac7-4523-be19-809308871d49",
          "23cfc17c-3fab-475b-9a1a-838b98e09bb8",
          "c4806b05-6476-4c67-95a5-fc9c4ce2aaa2",
          "9c59c8d2-586a-4845-b969-43be1fd3b388",
        ],
      },
    ],
  },
  "sandayu-oda-hanako-s-guardian": {
    freeArtId: "f452a0ca-3204-48d5-8565-ec746f27959b",
    artworks: [
      {
        artId: "f452a0ca-3204-48d5-8565-ec746f27959b",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "f452a0ca-3204-48d5-8565-ec746f27959b",
          "28cf40e2-f83a-47f4-9c4d-c0b5157e84e6",
        ],
      },
      {
        artId: "b1db8654-6197-4e80-9555-8917dcba6dc7",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["b1db8654-6197-4e80-9555-8917dcba6dc7"],
      },
    ],
  },
  "saul-bright-stormrider": {
    freeArtId: "60e476b4-51ab-4b10-8861-a8362b4232d7",
    artworks: [
      {
        artId: "60e476b4-51ab-4b10-8861-a8362b4232d7",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "60e476b4-51ab-4b10-8861-a8362b4232d7",
          "ce429abf-a099-48bf-a158-e32adc73b42e",
        ],
      },
    ],
  },
  "screw-lovelorn-fool": {
    freeArtId: "a7117b0f-74ab-44b5-87fb-de267d0f2164",
    artworks: [
      {
        artId: "a7117b0f-74ab-44b5-87fb-de267d0f2164",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "a7117b0f-74ab-44b5-87fb-de267d0f2164",
          "c614fc55-c071-456f-a5c3-7274e0073b0c",
        ],
      },
    ],
  },
  "secondhand-bombus": {
    freeArtId: "fcbb6d58-6666-4bd3-8ff0-64930fb0f422",
    artworks: [
      {
        artId: "fcbb6d58-6666-4bd3-8ff0-64930fb0f422",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "fcbb6d58-6666-4bd3-8ff0-64930fb0f422",
          "6a8e2aae-694a-43ea-8e3a-0482046a90c5",
          "b7d9313c-f2a4-40c0-85ed-81adb7653125",
          "2e2f977d-e0a6-4a21-a6b3-92937eb6e909",
          "62d6b51a-ceaf-498b-8a04-27c3d3e21feb",
        ],
      },
      {
        artId: "a78c25bb-94ce-4833-bcc4-be6dce72ecb1",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["a78c25bb-94ce-4833-bcc4-be6dce72ecb1"],
      },
      {
        artId: "9f7b3df5-721c-410f-8dec-5ce3bc4377c0",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["9f7b3df5-721c-410f-8dec-5ce3bc4377c0"],
      },
    ],
  },
  "sketchy-ripper": {
    freeArtId: "12f0398c-bcc3-4944-af72-ac2ae9f36761",
    artworks: [
      {
        artId: "12f0398c-bcc3-4944-af72-ac2ae9f36761",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "12f0398c-bcc3-4944-af72-ac2ae9f36761",
          "78b601e2-3dd5-4802-b0e2-5258a4a63363",
        ],
      },
    ],
  },
  "swordwise-huscle": {
    freeArtId: "1c053198-187e-49ab-a9e0-0661b4c3b337",
    artworks: [
      {
        artId: "1c053198-187e-49ab-a9e0-0661b4c3b337",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "1c053198-187e-49ab-a9e0-0661b4c3b337",
          "1b182145-b318-4b10-85e2-fdbf5afdf3c0",
          "9ecace66-9724-4582-8a45-ae614ffc640f",
          "6c695f7c-8b57-4932-aa4c-d85f0b1d29e3",
          "39ef1f5d-50e0-405c-bd25-6961fd93d2a1",
        ],
      },
    ],
  },
  "t-bug-amateur-philosopher": {
    freeArtId: "e2e3d98d-0159-4a79-b543-e37264f23118",
    artworks: [
      {
        artId: "e2e3d98d-0159-4a79-b543-e37264f23118",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "e2e3d98d-0159-4a79-b543-e37264f23118",
          "f3ca6b06-28da-42be-8526-743f22dc56b3",
          "46ddb436-ea2f-4c7f-b9b4-7987835c9cce",
          "646dde1d-a112-4c7b-aecc-f63e130d4df0",
        ],
      },
    ],
  },
  "trauma-team-operatives": {
    freeArtId: "0d6c1f36-628b-4631-a96d-2000f6fb054e",
    artworks: [
      {
        artId: "0d6c1f36-628b-4631-a96d-2000f6fb054e",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "0d6c1f36-628b-4631-a96d-2000f6fb054e",
          "df879b77-ca97-4e3d-8879-ecd73ceebf21",
        ],
      },
    ],
  },
  "tyger-s-whisper": {
    freeArtId: "28267ce7-17dc-42c4-b8c4-4235a7f3c3df",
    artworks: [
      {
        artId: "28267ce7-17dc-42c4-b8c4-4235a7f3c3df",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "28267ce7-17dc-42c4-b8c4-4235a7f3c3df",
          "4b7d734b-5cc2-4c57-9bcf-7e3b5a0f1f9f",
        ],
      },
    ],
  },
  "v-roamer-of-the-badlands": {
    freeArtId: "c1747b7d-de5c-43eb-a4ed-b632f1861712",
    artworks: [
      {
        artId: "c1747b7d-de5c-43eb-a4ed-b632f1861712",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "c1747b7d-de5c-43eb-a4ed-b632f1861712",
          "b460b92c-c0fd-43ed-84db-8615032e47f4",
        ],
      },
    ],
  },
  "valentino-guerrera": {
    freeArtId: "67b82386-5cb0-4ae7-b940-ac0d982b773c",
    artworks: [
      {
        artId: "67b82386-5cb0-4ae7-b940-ac0d982b773c",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "67b82386-5cb0-4ae7-b940-ac0d982b773c",
          "8d236321-e94e-41b1-8cb9-c2a533afc112",
        ],
      },
    ],
  },
  "valentino-street-racer": {
    freeArtId: "dc15db71-3443-4de0-b988-c62601bae5e1",
    artworks: [
      {
        artId: "dc15db71-3443-4de0-b988-c62601bae5e1",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "dc15db71-3443-4de0-b988-c62601bae5e1",
          "c828bc68-23a3-41ef-878b-00b13ccf0cdc",
        ],
      },
    ],
  },
  "viktor-vektor-drop-your-illusions": {
    freeArtId: "2285cd3a-7010-4ba4-b23a-ba40aba296f9",
    artworks: [
      {
        artId: "2285cd3a-7010-4ba4-b23a-ba40aba296f9",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "2285cd3a-7010-4ba4-b23a-ba40aba296f9",
          "ade4a2d5-df74-44fe-ab5f-222dc6e2ce27",
        ],
      },
    ],
  },
  "viktor-vektor-you-might-feel-a-little-pinch": {
    freeArtId: "4eca7fcd-85c1-43d0-8a07-4227312ab0db",
    artworks: [
      {
        artId: "4eca7fcd-85c1-43d0-8a07-4227312ab0db",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "4eca7fcd-85c1-43d0-8a07-4227312ab0db",
          "e3005cf1-4dbc-4f4e-922b-af81d6086015",
        ],
      },
    ],
  },
  "westbrook-netrunner": {
    freeArtId: "5801d086-7e87-4645-95e2-68239230098d",
    artworks: [
      {
        artId: "5801d086-7e87-4645-95e2-68239230098d",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "5801d086-7e87-4645-95e2-68239230098d",
          "1e2413a0-aa80-4883-806a-d8e9ed32bbca",
        ],
      },
    ],
  },
  "wraith-marauders": {
    freeArtId: "0944037e-5b14-4332-b345-7935924c2125",
    artworks: [
      {
        artId: "0944037e-5b14-4332-b345-7935924c2125",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "0944037e-5b14-4332-b345-7935924c2125",
          "89c5ec5e-dcc1-4ce4-970d-28b0226272b1",
        ],
      },
      {
        artId: "7757b045-4ccf-432b-b412-c82a44ee3adc",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["7757b045-4ccf-432b-b412-c82a44ee3adc"],
      },
      {
        artId: "36d849b2-3d3a-4113-bc69-214a8a91e6d6",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["36d849b2-3d3a-4113-bc69-214a8a91e6d6"],
      },
    ],
  },
  "yorinobu-arasaka-steel-dragon": {
    freeArtId: "c057ccc4-bb15-4efd-8115-8d223568134b",
    artworks: [
      {
        artId: "c057ccc4-bb15-4efd-8115-8d223568134b",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "c057ccc4-bb15-4efd-8115-8d223568134b",
          "19ef8a11-606b-44f3-b20e-08800c9d6cc2",
        ],
      },
    ],
  },
  "adrenaline-converter": {
    freeArtId: "535df2a9-d2af-463c-85dd-dafe67cab8fb",
    artworks: [
      {
        artId: "535df2a9-d2af-463c-85dd-dafe67cab8fb",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "535df2a9-d2af-463c-85dd-dafe67cab8fb",
          "ccb79cf1-fc2d-4b52-bea5-b427583bfe1b",
        ],
      },
    ],
  },
  "arasaka-emergency-radioport": {
    freeArtId: "d2da65d5-fdaf-44f4-a692-a5672d2c1cca",
    artworks: [
      {
        artId: "d2da65d5-fdaf-44f4-a692-a5672d2c1cca",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "d2da65d5-fdaf-44f4-a692-a5672d2c1cca",
          "7ff6a088-1720-45b6-a3cf-30709415df5e",
          "49c919ef-61d7-47d3-b855-1d4d7c0f783f",
          "be0d995d-84fc-41c3-bed6-1875caf85fc7",
        ],
      },
    ],
  },
  "deadman-transmitter": {
    freeArtId: "32957075-42ff-47e3-8252-e78877ef61f7",
    artworks: [
      {
        artId: "32957075-42ff-47e3-8252-e78877ef61f7",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: ["32957075-42ff-47e3-8252-e78877ef61f7"],
      },
      {
        artId: "e53bdb8b-5b1f-4f31-ad74-a43a4925c2d1",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["e53bdb8b-5b1f-4f31-ad74-a43a4925c2d1"],
      },
    ],
  },
  "dying-night-v-s-pistol": {
    freeArtId: "2b1b6268-193f-4b9e-a63c-0cbc200d6db7",
    artworks: [
      {
        artId: "2b1b6268-193f-4b9e-a63c-0cbc200d6db7",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "2b1b6268-193f-4b9e-a63c-0cbc200d6db7",
          "3ceebded-0941-477f-b486-f2cb22ca653d",
          "4bb35017-9842-4178-99a6-34353a3de2d4",
          "1dc3c618-a40a-4717-bf4d-a573915c8ac0",
          "dd423c67-68f4-4da8-884c-cbeb91554c0d",
        ],
      },
      {
        artId: "70ef0b79-d569-4a62-bdbc-e02c616f8b98",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["70ef0b79-d569-4a62-bdbc-e02c616f8b98"],
      },
      {
        artId: "779c63a5-cec1-47b0-a96e-51369a0ba186",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["779c63a5-cec1-47b0-a96e-51369a0ba186"],
      },
    ],
  },
  "gorilla-arms": {
    freeArtId: "e1959b9e-d32d-43be-94c3-a595809e0c28",
    artworks: [
      {
        artId: "e1959b9e-d32d-43be-94c3-a595809e0c28",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "e1959b9e-d32d-43be-94c3-a595809e0c28",
          "73b6b3d3-6a7f-44ed-a267-add6ae389b5a",
        ],
      },
    ],
  },
  "kiroshi-optics": {
    freeArtId: "ec3368a9-79f1-4dfc-9cf7-1cb464ec1c88",
    artworks: [
      {
        artId: "ec3368a9-79f1-4dfc-9cf7-1cb464ec1c88",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "ec3368a9-79f1-4dfc-9cf7-1cb464ec1c88",
          "d35720e4-f307-4732-ae3d-8f47f1351549",
          "aa9b8a2e-ffd6-4435-8bed-c4e64e1c32ac",
          "b18ce43d-3441-4a55-a6a9-34ae8765aa27",
          "57e1d9b6-0f2b-497b-acaf-49c20a68cd19",
        ],
      },
    ],
  },
  "mandibular-upgrade": {
    freeArtId: "219b7a29-0f8b-4750-bc46-0f39eec6721b",
    artworks: [
      {
        artId: "219b7a29-0f8b-4750-bc46-0f39eec6721b",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "219b7a29-0f8b-4750-bc46-0f39eec6721b",
          "dc0a7e03-54b6-4334-965f-27a3d469fed6",
          "d13b8b15-8e31-448c-b28b-322bb498d0a7",
          "c3399413-d205-49e7-871a-4f16d7c3ade6",
          "49fc6d6e-8e86-4a05-bcd5-bd8a50edf5dc",
        ],
      },
      {
        artId: "d16f9b63-cc98-4b88-981e-258d1940aa04",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["d16f9b63-cc98-4b88-981e-258d1940aa04"],
      },
      {
        artId: "34dd1e1b-5022-4858-91bc-1243ea7f4615",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["34dd1e1b-5022-4858-91bc-1243ea7f4615"],
      },
    ],
  },
  "mantis-blades": {
    freeArtId: "7ffa8ba4-f187-4ba0-a719-fa8ebf45a03b",
    artworks: [
      {
        artId: "7ffa8ba4-f187-4ba0-a719-fa8ebf45a03b",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "7ffa8ba4-f187-4ba0-a719-fa8ebf45a03b",
          "84278f23-7323-47d2-b639-23edd76f87ae",
          "087c30c2-1a7d-423e-b2f3-a7e1e8cfca12",
          "7e3cd1e0-4438-46e7-a327-0d9846778bb3",
          "4ad21be4-1406-4631-bfe7-ad2effde7af2",
        ],
      },
      {
        artId: "2ec85468-7593-4af5-b0d9-aecc1bc82366",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["2ec85468-7593-4af5-b0d9-aecc1bc82366"],
      },
    ],
  },
  "netwatch-netdriver": {
    freeArtId: "07f119d6-8fb2-4b23-9862-818a7e941010",
    artworks: [
      {
        artId: "07f119d6-8fb2-4b23-9862-818a7e941010",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "07f119d6-8fb2-4b23-9862-818a7e941010",
          "e2a34251-d2d9-46e0-9840-ca69a358a6ae",
        ],
      },
      {
        artId: "f8098004-7b14-4d5a-8398-85c5660e1d8f",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["f8098004-7b14-4d5a-8398-85c5660e1d8f"],
      },
      {
        artId: "fbe9274d-e4c4-415f-9914-0fbd5985c0b3",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["fbe9274d-e4c4-415f-9914-0fbd5985c0b3"],
      },
    ],
  },
  "overwatch-panam-s-gift": {
    freeArtId: "336131d1-3bc8-4b39-b893-5fce9be8ce7f",
    artworks: [
      {
        artId: "336131d1-3bc8-4b39-b893-5fce9be8ce7f",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "336131d1-3bc8-4b39-b893-5fce9be8ce7f",
          "0f825d0d-be91-4f42-9e97-5d87488ee2fc",
        ],
      },
      {
        artId: "775e7d6b-b9d9-48cf-a34d-00ba2b1c0a43",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["775e7d6b-b9d9-48cf-a34d-00ba2b1c0a43"],
      },
    ],
  },
  "riot-shield": {
    freeArtId: "ce570725-0de7-438a-a9c8-33074a7180ba",
    artworks: [
      {
        artId: "ce570725-0de7-438a-a9c8-33074a7180ba",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "ce570725-0de7-438a-a9c8-33074a7180ba",
          "fa711a0e-06bb-429b-a43a-89c50fb9d590",
        ],
      },
    ],
  },
  sandevistan: {
    freeArtId: "97de62e2-3fea-4324-8367-87d1f1d674ed",
    artworks: [
      {
        artId: "97de62e2-3fea-4324-8367-87d1f1d674ed",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "97de62e2-3fea-4324-8367-87d1f1d674ed",
          "f0de2baf-27a9-426e-89cf-68abaceec507",
          "a4684963-6c44-4e6e-9466-56d987f86112",
          "e1a14bfa-cd87-4fa9-bfe8-207abb4545c4",
        ],
      },
      {
        artId: "a9eb38f2-fe64-47c5-9938-9b6ecb01c913",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: [
          "a9eb38f2-fe64-47c5-9938-9b6ecb01c913",
          "6f8d1015-dd5d-49c4-9620-6b3b0c7ee82a",
        ],
      },
      {
        artId: "36d42759-0199-47f0-835b-ee6616842e49",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["36d42759-0199-47f0-835b-ee6616842e49"],
      },
    ],
  },
  "satori-sword-of-saburo": {
    freeArtId: "11a8fed4-5401-4cfc-901b-ab9b5b94d0ab",
    artworks: [
      {
        artId: "11a8fed4-5401-4cfc-901b-ab9b5b94d0ab",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "11a8fed4-5401-4cfc-901b-ab9b5b94d0ab",
          "b12e1665-bf29-4b2c-b92d-865cff227a67",
          "0e0e7e20-eaf3-4dea-a177-cb54e01ffec6",
          "e9dba54d-79bf-4f33-bd67-ba026e371c03",
          "3b656cec-684d-440b-9c76-0aa9a4a98b81",
        ],
      },
      {
        artId: "c0a913fe-d3fc-4558-a35f-cfa34d4023c3",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["c0a913fe-d3fc-4558-a35f-cfa34d4023c3"],
      },
      {
        artId: "922e0824-cef0-4062-bb6f-5e30f4814f40",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["922e0824-cef0-4062-bb6f-5e30f4814f40"],
      },
    ],
  },
  "tetratronic-rippler": {
    freeArtId: "576f82ff-3c4d-4637-aa91-2773de43bbc8",
    artworks: [
      {
        artId: "576f82ff-3c4d-4637-aa91-2773de43bbc8",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "576f82ff-3c4d-4637-aa91-2773de43bbc8",
          "74eb81ab-aa0a-4b09-8cfe-94dddd70f4b1",
          "39747fc8-20a0-4fbb-80d7-2a869b735ac9",
          "7ef4d862-b97f-47be-ba0f-071c8e8354b0",
        ],
      },
    ],
  },
  "the-relic-experimental-biochip": {
    freeArtId: "38d14168-c182-4a34-a3b2-1b8380ab6635",
    artworks: [
      {
        artId: "38d14168-c182-4a34-a3b2-1b8380ab6635",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "38d14168-c182-4a34-a3b2-1b8380ab6635",
          "a55809aa-170d-42b4-8768-f0b873fd0dc4",
        ],
      },
      {
        artId: "9a4fafb2-b27b-4b3e-9f57-502040898b0f",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["9a4fafb2-b27b-4b3e-9f57-502040898b0f"],
      },
    ],
  },
  "zetatech-berserk": {
    freeArtId: "8b8bcfcd-37c8-4bca-8c25-17a3b3363349",
    artworks: [
      {
        artId: "8b8bcfcd-37c8-4bca-8c25-17a3b3363349",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "8b8bcfcd-37c8-4bca-8c25-17a3b3363349",
          "36735ea2-1489-4e7a-810f-20dab24d503b",
        ],
      },
    ],
  },
  "zetatech-faceplate": {
    freeArtId: "79cdc9a5-d94d-4df4-9f88-aa02fb0357b3",
    artworks: [
      {
        artId: "79cdc9a5-d94d-4df4-9f88-aa02fb0357b3",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "79cdc9a5-d94d-4df4-9f88-aa02fb0357b3",
          "25077971-70cc-4524-b7cf-cd8258abc28c",
          "26b755e4-b754-48fc-b89b-ba8ce670d43b",
          "e38dee5b-9f4a-4323-a18f-aff42256b158",
        ],
      },
    ],
  },
  "afterparty-at-lizzie-s": {
    freeArtId: "d53925ee-df55-4b71-8ca0-13ec3ede2076",
    artworks: [
      {
        artId: "d53925ee-df55-4b71-8ca0-13ec3ede2076",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "d53925ee-df55-4b71-8ca0-13ec3ede2076",
          "5adb7a6a-de7b-4f00-9d5a-2cccfaf4f19d",
          "17db8555-a470-4c5b-9a24-4fac4bf04c4c",
          "a8dcad7d-7b45-427d-8123-3140b30ac612",
          "eb272131-add5-4dda-b426-4166041af144",
        ],
      },
      {
        artId: "c28c3d15-1e03-465c-a696-cf395a795abc",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["c28c3d15-1e03-465c-a696-cf395a795abc"],
      },
      {
        artId: "08a9b9ec-16b7-407a-90f2-a9536937b879",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["08a9b9ec-16b7-407a-90f2-a9536937b879"],
      },
    ],
  },
  "all-is-lost": {
    freeArtId: "d1a3c0e0-e0e7-418d-afb4-e6e43400c42e",
    artworks: [
      {
        artId: "d1a3c0e0-e0e7-418d-afb4-e6e43400c42e",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "d1a3c0e0-e0e7-418d-afb4-e6e43400c42e",
          "27a2fceb-5c37-4cfa-8efb-1e4618d22401",
        ],
      },
    ],
  },
  "appetite-for-destruction": {
    freeArtId: "f274789d-69f2-4acf-a511-f728c67d1a13",
    artworks: [
      {
        artId: "f274789d-69f2-4acf-a511-f728c67d1a13",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "f274789d-69f2-4acf-a511-f728c67d1a13",
          "d2aed299-7c88-484a-aa8a-e2e2f09bf8a8",
        ],
      },
    ],
  },
  "bonnie-and-clyde": {
    freeArtId: "26d60270-1b43-4af3-a8b7-1c3db9675cfa",
    artworks: [
      {
        artId: "26d60270-1b43-4af3-a8b7-1c3db9675cfa",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "26d60270-1b43-4af3-a8b7-1c3db9675cfa",
          "2ca6ae1f-b10c-439d-a929-cd82c3b1158c",
        ],
      },
    ],
  },
  "bootleg-black-sapphire-show": {
    freeArtId: "decc76ed-f5ed-4f02-90d7-e01e2a3975e0",
    artworks: [
      {
        artId: "decc76ed-f5ed-4f02-90d7-e01e2a3975e0",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "decc76ed-f5ed-4f02-90d7-e01e2a3975e0",
          "20c23b0f-187d-41d8-9670-b8e603049b3d",
        ],
      },
      {
        artId: "f997c534-5208-4c37-8aff-4f6587e606c2",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["f997c534-5208-4c37-8aff-4f6587e606c2"],
      },
      {
        artId: "86bc6f96-41d3-4639-b75b-25ae58202b3d",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["86bc6f96-41d3-4639-b75b-25ae58202b3d"],
      },
    ],
  },
  "carnage-at-the-colosseum": {
    freeArtId: "36128749-4cb1-440d-b4de-4fd463cc2f5c",
    artworks: [
      {
        artId: "36128749-4cb1-440d-b4de-4fd463cc2f5c",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "36128749-4cb1-440d-b4de-4fd463cc2f5c",
          "171b21b1-90d0-4d3b-a060-740c413b7bf2",
        ],
      },
    ],
  },
  "chrome-reverie": {
    freeArtId: "3f0319b8-e315-4e71-85b7-147a5b8ceba5",
    artworks: [
      {
        artId: "3f0319b8-e315-4e71-85b7-147a5b8ceba5",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "3f0319b8-e315-4e71-85b7-147a5b8ceba5",
          "0be394e3-ce41-4f16-a95b-33ec951bf43c",
        ],
      },
    ],
  },
  "corporate-surveillance": {
    freeArtId: "d3dc7194-a545-4588-9702-b094c27ce359",
    artworks: [
      {
        artId: "d3dc7194-a545-4588-9702-b094c27ce359",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "d3dc7194-a545-4588-9702-b094c27ce359",
          "539138ff-af5a-47e3-abf0-cc772eaa8b9e",
          "8a13760d-050c-4a9c-bc44-f6b5796bb9f2",
          "e9d18fa1-0069-4b22-b64e-a75d2e30158a",
          "af658f81-5214-4f56-ba8a-782a4419e366",
        ],
      },
    ],
  },
  cyberpsychosis: {
    freeArtId: "5aafe80b-7c7d-4060-8677-a2881a21dd72",
    artworks: [
      {
        artId: "5aafe80b-7c7d-4060-8677-a2881a21dd72",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "5aafe80b-7c7d-4060-8677-a2881a21dd72",
          "b3329aae-77de-4c61-b400-114f51bbae5a",
        ],
      },
      {
        artId: "88002e9c-429e-4434-8564-e1b22625ce4e",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["88002e9c-429e-4434-8564-e1b22625ce4e"],
      },
      {
        artId: "968eff55-5775-44c1-b5e0-7b1b9293763e",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["968eff55-5775-44c1-b5e0-7b1b9293763e"],
      },
    ],
  },
  detonate: {
    freeArtId: "bec995b7-b76b-4605-9c36-3d7697cdd4f5",
    artworks: [
      {
        artId: "bec995b7-b76b-4605-9c36-3d7697cdd4f5",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "bec995b7-b76b-4605-9c36-3d7697cdd4f5",
          "0ecf513b-64fd-4932-a004-b02b43b21e88",
        ],
      },
    ],
  },
  "don-t-fear-the-reaper": {
    freeArtId: "e96d3167-5115-4c82-9b35-546cba0aaead",
    artworks: [
      {
        artId: "e96d3167-5115-4c82-9b35-546cba0aaead",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "e96d3167-5115-4c82-9b35-546cba0aaead",
          "1f173d96-9ca1-4298-b479-71f06ee1f558",
        ],
      },
      {
        artId: "bd897ed7-a74b-4993-9da5-16f820c3502d",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["bd897ed7-a74b-4993-9da5-16f820c3502d"],
      },
      {
        artId: "6121b4c1-b899-4c69-a7d6-674bb6889e29",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["6121b4c1-b899-4c69-a7d6-674bb6889e29"],
      },
    ],
  },
  "floor-it": {
    freeArtId: "91f9d30c-f74d-4be4-8505-52f05d309c92",
    artworks: [
      {
        artId: "91f9d30c-f74d-4be4-8505-52f05d309c92",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "91f9d30c-f74d-4be4-8505-52f05d309c92",
          "859c8d1d-b715-4a9a-b7cc-96ecfe135a00",
          "60255f42-3ddd-4865-9e4a-335963694be1",
          "d8b28345-bcd5-4c52-b51d-3052d8b24874",
          "9d62921e-382e-4e93-85d8-aa628566ccd7",
        ],
      },
      {
        artId: "2267884a-40c8-49ff-952b-90ec1b977179",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["2267884a-40c8-49ff-952b-90ec1b977179"],
      },
      {
        artId: "575138c0-4eae-4d61-abf7-028557a884c8",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["575138c0-4eae-4d61-abf7-028557a884c8"],
      },
    ],
  },
  "fool-on-the-hill": {
    freeArtId: "7751b719-978b-44b1-a82f-b2881d3a416e",
    artworks: [
      {
        artId: "7751b719-978b-44b1-a82f-b2881d3a416e",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "7751b719-978b-44b1-a82f-b2881d3a416e",
          "04511c2f-c766-4d1a-9176-66f913789667",
        ],
      },
    ],
  },
  "gunpoint-diplomacy": {
    freeArtId: "efc5dfdd-f393-4bbe-a7bc-ac959ba1e6bc",
    artworks: [
      {
        artId: "efc5dfdd-f393-4bbe-a7bc-ac959ba1e6bc",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "efc5dfdd-f393-4bbe-a7bc-ac959ba1e6bc",
          "e3d061b0-fb02-481d-8afa-f4b5bce4ed39",
        ],
      },
    ],
  },
  "industrial-assembly": {
    freeArtId: "9103b5db-bf95-4385-8941-308cb0353c9a",
    artworks: [
      {
        artId: "9103b5db-bf95-4385-8941-308cb0353c9a",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "9103b5db-bf95-4385-8941-308cb0353c9a",
          "161bfaaf-ec85-4142-8538-f5faf9181267",
          "301b47dd-eab3-4648-aece-bc071b87dcd1",
          "84bdb994-a01d-4e4c-81d9-a970aef4d08c",
          "7f0ad31f-3b16-4c7a-88bb-90dd07e55a9b",
        ],
      },
      {
        artId: "36728e75-5520-4ba8-a82d-e5d884b18170",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["36728e75-5520-4ba8-a82d-e5d884b18170"],
      },
      {
        artId: "5d10162b-32ad-4391-bc39-8b652142e707",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["5d10162b-32ad-4391-bc39-8b652142e707"],
      },
    ],
  },
  "les-elemens": {
    freeArtId: "14a0b813-d5e3-46e6-a001-aebbd3a95f11",
    artworks: [
      {
        artId: "14a0b813-d5e3-46e6-a001-aebbd3a95f11",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "14a0b813-d5e3-46e6-a001-aebbd3a95f11",
          "7e86c639-5225-4a91-be33-6ab86c9adfe2",
        ],
      },
    ],
  },
  "live-with-the-aftermath": {
    freeArtId: "f931c82e-a382-4f60-808c-5910ac9850be",
    artworks: [
      {
        artId: "f931c82e-a382-4f60-808c-5910ac9850be",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "f931c82e-a382-4f60-808c-5910ac9850be",
          "b2d6aeff-8fa3-4151-9e67-a83188a78197",
        ],
      },
    ],
  },
  "memory-relapse": {
    freeArtId: "ef9f2959-de87-4a54-be45-5c9dcc507aba",
    artworks: [
      {
        artId: "ef9f2959-de87-4a54-be45-5c9dcc507aba",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "ef9f2959-de87-4a54-be45-5c9dcc507aba",
          "7a8c2032-e753-43ab-9c3b-adefb4281241",
        ],
      },
    ],
  },
  "nocturne-op55-n1": {
    freeArtId: "70c7f11e-e41d-44f2-b5cd-e8568915d6ac",
    artworks: [
      {
        artId: "70c7f11e-e41d-44f2-b5cd-e8568915d6ac",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "70c7f11e-e41d-44f2-b5cd-e8568915d6ac",
          "dfd5d1df-2b47-4ddd-9d6a-35430a892cfc",
        ],
      },
    ],
  },
  "over-the-edge": {
    freeArtId: "f1cf4133-45ef-4de5-abfc-757de1613731",
    artworks: [
      {
        artId: "f1cf4133-45ef-4de5-abfc-757de1613731",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "f1cf4133-45ef-4de5-abfc-757de1613731",
          "6213bf57-92d7-4a64-8d80-948ba53b8d80",
          "9e5a152e-6105-44a4-8db0-9cbf6cda2252",
          "de9b7361-6d1c-4a27-bcfb-50ec7a78e518",
          "cf48d5e6-21d2-4d17-a731-5dc9091c6cd1",
        ],
      },
    ],
  },
  "peace-offering": {
    freeArtId: "8570122a-52aa-4a6b-8d72-4c8848df0f9b",
    artworks: [
      {
        artId: "8570122a-52aa-4a6b-8d72-4c8848df0f9b",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "8570122a-52aa-4a6b-8d72-4c8848df0f9b",
          "2cff513f-6a75-40f0-8e70-e1491d340472",
        ],
      },
      {
        artId: "98fc95b4-44ec-4de0-bec3-77762792fa0f",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["98fc95b4-44ec-4de0-bec3-77762792fa0f"],
      },
      {
        artId: "af1c8374-41a9-4fd7-8597-c6481705c210",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["af1c8374-41a9-4fd7-8597-c6481705c210"],
      },
    ],
  },
  "pyramid-song": {
    freeArtId: "3b1d0570-bb8e-4ea5-9ec7-c698d9c9f94d",
    artworks: [
      {
        artId: "3b1d0570-bb8e-4ea5-9ec7-c698d9c9f94d",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "3b1d0570-bb8e-4ea5-9ec7-c698d9c9f94d",
          "bab79ef1-57fb-4b24-b50a-e08899699862",
        ],
      },
    ],
  },
  "reboot-optics": {
    freeArtId: "fb096d3f-48eb-47c0-a065-81b39691e12f",
    artworks: [
      {
        artId: "fb096d3f-48eb-47c0-a065-81b39691e12f",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "fb096d3f-48eb-47c0-a065-81b39691e12f",
          "06570cd2-25fc-4c5e-86e1-cba8000edc97",
          "270c2b70-35fb-4d47-b1c0-3df11141f880",
          "f393f463-2e62-4d77-aaf4-ed1bafaee8c5",
          "7a8acee6-f460-4d2d-aaa3-3d057ef7c36c",
        ],
      },
    ],
  },
  "safety-override": {
    freeArtId: "5d987aa8-baed-45b2-986c-a21e04a53331",
    artworks: [
      {
        artId: "5d987aa8-baed-45b2-986c-a21e04a53331",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "5d987aa8-baed-45b2-986c-a21e04a53331",
          "af696a54-97bf-475b-b721-9a8bb86227a0",
        ],
      },
    ],
  },
  "shattered-memories": {
    freeArtId: "3401c7cf-45c5-4fe4-a883-284a9334262d",
    artworks: [
      {
        artId: "3401c7cf-45c5-4fe4-a883-284a9334262d",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "3401c7cf-45c5-4fe4-a883-284a9334262d",
          "80735f9a-6c20-4d24-9138-b3c0d2e6bf46",
          "b03a2e07-73a4-49c4-b4a3-761748a7b09e",
          "4adda471-e0c8-4628-aba1-d1ed11eae0af",
        ],
      },
    ],
  },
  "synapse-burnout": {
    freeArtId: "4277845b-1209-46df-8353-8fd36f56148a",
    artworks: [
      {
        artId: "4277845b-1209-46df-8353-8fd36f56148a",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "4277845b-1209-46df-8353-8fd36f56148a",
          "535cec6e-269d-4c2d-860c-5c8eff999c21",
        ],
      },
    ],
  },
  "take-control": {
    freeArtId: "bc1401d4-5b9b-495a-853e-0a22a11f6f4c",
    artworks: [
      {
        artId: "bc1401d4-5b9b-495a-853e-0a22a11f6f4c",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "bc1401d4-5b9b-495a-853e-0a22a11f6f4c",
          "a7a49ccf-4b85-4997-b08c-16e8e80d9aa8",
        ],
      },
    ],
  },
  "the-heist": {
    freeArtId: "a1e2c25e-fb27-458f-984d-df422f879664",
    artworks: [
      {
        artId: "a1e2c25e-fb27-458f-984d-df422f879664",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "a1e2c25e-fb27-458f-984d-df422f879664",
          "709ec425-eda5-4621-b907-94a507a20351",
        ],
      },
    ],
  },
  "three-mouths-one-desire": {
    freeArtId: "573a88e9-ac01-4402-8e3d-2420dc4ca949",
    artworks: [
      {
        artId: "573a88e9-ac01-4402-8e3d-2420dc4ca949",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "573a88e9-ac01-4402-8e3d-2420dc4ca949",
          "0449bc78-983b-4681-b062-0738de3c487b",
        ],
      },
    ],
  },
  towerfall: {
    freeArtId: "15920617-a06f-4302-9dfb-c85d3470c7eb",
    artworks: [
      {
        artId: "15920617-a06f-4302-9dfb-c85d3470c7eb",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "15920617-a06f-4302-9dfb-c85d3470c7eb",
          "25508f49-7256-47be-bc95-c420c7105c62",
        ],
      },
      {
        artId: "4d8a1ccb-6d46-45b1-839a-fd3b7fa84b72",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["4d8a1ccb-6d46-45b1-839a-fd3b7fa84b72"],
      },
    ],
  },
  "trust-no-one": {
    freeArtId: "70a2a18e-05c2-4a49-9236-e33b2c9819a5",
    artworks: [
      {
        artId: "70a2a18e-05c2-4a49-9236-e33b2c9819a5",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "70a2a18e-05c2-4a49-9236-e33b2c9819a5",
          "f9a81013-9c64-4e48-8d1d-cd1b41b72ee0",
        ],
      },
      {
        artId: "a0d5fd79-b00b-408d-89c5-ff8721da568c",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["a0d5fd79-b00b-408d-89c5-ff8721da568c"],
      },
      {
        artId: "959451ee-79cc-4caa-97bd-cbb3e5f1a70a",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["959451ee-79cc-4caa-97bd-cbb3e5f1a70a"],
      },
    ],
  },
  "unlikely-bond": {
    freeArtId: "b21f86a3-cb77-44a3-bf94-4c5e068ac2c8",
    artworks: [
      {
        artId: "b21f86a3-cb77-44a3-bf94-4c5e068ac2c8",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "b21f86a3-cb77-44a3-bf94-4c5e068ac2c8",
          "54575eba-9d21-43fe-b6df-7cd2564dd37b",
        ],
      },
    ],
  },
  "we-gotta-live-together": {
    freeArtId: "63821536-cdf5-4347-812a-0bf72d727596",
    artworks: [
      {
        artId: "63821536-cdf5-4347-812a-0bf72d727596",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "63821536-cdf5-4347-812a-0bf72d727596",
          "3488c7f7-c797-4c3a-8d49-e5cdcf0e8d74",
        ],
      },
      {
        artId: "3a3900be-bbee-4218-8b58-0e5fa445ee46",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["3a3900be-bbee-4218-8b58-0e5fa445ee46"],
      },
      {
        artId: "aea6c98e-6bc5-4912-b7d8-a6558fde5eaf",
        category: "alternate",
        reason: "Visible alternate illustration or treatment; Atelier access is required.",
        printingIds: ["aea6c98e-6bc5-4912-b7d8-a6558fde5eaf"],
      },
    ],
  },
  "wild-in-the-streets": {
    freeArtId: "54f0308f-8fb2-4861-a414-c15ca24426c3",
    artworks: [
      {
        artId: "54f0308f-8fb2-4861-a414-c15ca24426c3",
        category: "standard",
        reason:
          "Same visible illustration and presentation; set and collector metadata are not appearance changes.",
        printingIds: [
          "54f0308f-8fb2-4861-a414-c15ca24426c3",
          "bc78db9f-337e-437e-b247-f1aa798c48d0",
        ],
      },
    ],
  },
} as const satisfies Readonly<Record<string, CyberpunkCanonicalArtwork>>;
