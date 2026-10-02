import { PocketIc, createIdentity } from "@dfinity/pic";
import type { Actor, CanisterFixture } from "@dfinity/pic";
import { afterAll, beforeAll, expect, it } from "vitest";

import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { _SERVICE } from "../../src/frontend/src/declarations/backend.did";

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";

let pic: PocketIc | undefined;
let actor: Actor<_SERVICE>;
let canisterId: CanisterFixture<_SERVICE>["canisterId"];

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  ({ actor, canisterId } = await pic.setupCanister<_SERVICE>({
    idlFactory,
    wasm: BACKEND_WASM,
  }));
});

afterAll(async () => {
  await pic?.tearDown();
});

it("seeds the national register and answers the overview reads", async () => {
  const electorates = await actor.listElectorates();
  expect(electorates.length).toBeGreaterThan(0);

  const summary = await actor.getNationalSummary();
  expect(summary.totalElectorates).toBe(BigInt(electorates.length));
  expect(summary.totalProvinces).toBeGreaterThan(0n);
  expect(summary.totalRegisteredVoters).toBeGreaterThan(0n);
  expect(summary.countsByProvince.length).toBeGreaterThan(0);
  expect(summary.countsBySupportLevel).toHaveLength(5);
});

it("returns a single electorate by id and an empty option for an unknown id", async () => {
  const [first] = await actor.listElectorates();
  const found = await actor.getElectorate(first.id);
  expect(found).toHaveLength(1);
  expect(found[0]).toMatchObject({ id: first.id, name: first.name });

  const missing = await actor.getElectorate(999_999n);
  expect(missing).toEqual([]);
});

it("starts with no activity and returns an empty list for an unknown electorate", async () => {
  const [first] = await actor.listElectorates();
  await expect(actor.listActivities(first.id)).resolves.toEqual([]);
  await expect(actor.listRecentActivities(8n)).resolves.toEqual([]);
});

it("rejects an anonymous caller from writing campaign details", async () => {
  const [first] = await actor.listElectorates();
  const guest = pic!.createActor<_SERVICE>(idlFactory, canisterId);
  await expect(
    guest.updateCampaignDetails(first.id, {
      supportLevel: { Strong: null },
      campaignManager: "Anonymous",
      notes: "should not persist",
    }),
  ).rejects.toThrow();
});

it("rejects an anonymous caller from adding an activity", async () => {
  const [first] = await actor.listElectorates();
  const guest = pic!.createActor<_SERVICE>(idlFactory, canisterId);
  await expect(
    guest.addActivity(first.id, {
      activityType: { note: null },
      date: 0n,
      description: "should not persist",
    }),
  ).rejects.toThrow();
});

it("lets an admin update campaign details and add an activity that persists", async () => {
  // Registration is the documented prerequisite for admin access: the first
  // principal to call `_initialize_access_control` becomes `#admin`.
  const admin = createIdentity("admin");
  actor.setIdentity(admin);
  await actor._initialize_access_control();
  await expect(actor.isCallerAdmin()).resolves.toBe(true);

  const [first] = await actor.listElectorates();
  const updated = await actor.updateCampaignDetails(first.id, {
    supportLevel: { Strong: null },
    campaignManager: "Alice",
    notes: "Committed",
  });
  expect(updated).toHaveLength(1);
  expect(updated[0]).toMatchObject({
    id: first.id,
    supportLevel: { Strong: null },
    campaignManager: "Alice",
    notes: "Committed",
  });

  const created = await actor.addActivity(first.id, {
    activityType: { event: null },
    date: 1_700_000_000_000_000_000n,
    description: "Rally in the capital",
  });
  expect(created).toHaveLength(1);
  expect(created[0]).toMatchObject({
    electorateId: first.id,
    activityType: { event: null },
    description: "Rally in the capital",
  });

  const activities = await actor.listActivities(first.id);
  expect(activities).toHaveLength(1);
  expect(activities[0].description).toBe("Rally in the capital");

  const recent = await actor.listRecentActivities(8n);
  expect(recent).toHaveLength(1);
  expect(recent[0].description).toBe("Rally in the capital");

  const summary = await actor.getNationalSummary();
  expect(summary.totalActivities).toBe(1n);
});

it("returns null when adding an activity to an unknown electorate", async () => {
  // The first registered principal is the admin; re-registering the same
  // identity is a no-op, so this test can rely on the admin role set above.
  const admin = createIdentity("admin");
  actor.setIdentity(admin);
  await actor._initialize_access_control();

  const result = await actor.addActivity(999_999n, {
    activityType: { note: null },
    date: 0n,
    description: "orphan",
  });
  expect(result).toEqual([]);
});
