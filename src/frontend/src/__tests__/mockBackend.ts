import type { ActivityId } from "@/backend";
import type {
  CampaignActivity,
  Electorate,
  ElectorateId,
  NationalSummary,
  NewActivity,
  UpdateCampaignDetails,
} from "@/lib/electorates";
import { ActivityType, SeatType, SupportLevel } from "@/lib/electorates";

/**
 * A typed in-memory stand-in for the generated `Backend` actor. It implements
 * the same public surface the app's hooks call, so component tests exercise the
 * real hooks, queries, and rendering without a network or a canister.
 *
 * This is a mock: it proves nothing about the Motoko backend. The PocketIC lane
 * (`app/test/pocketic/backend.test.ts`) is what calls the real canister.
 */
export interface MockBackend {
  listElectorates(): Promise<Electorate[]>;
  getElectorate(id: ElectorateId): Promise<Electorate | null>;
  listActivities(electorateId: ElectorateId): Promise<CampaignActivity[]>;
  getNationalSummary(): Promise<NationalSummary>;
  listRecentActivities(limit: bigint): Promise<CampaignActivity[]>;
  isCallerAdmin(): Promise<boolean>;
  updateCampaignDetails(
    id: ElectorateId,
    details: UpdateCampaignDetails,
  ): Promise<Electorate | null>;
  addActivity(
    electorateId: ElectorateId,
    input: NewActivity,
  ): Promise<CampaignActivity | null>;
}

export interface MockBackendState {
  electorates: Electorate[];
  activities: CampaignActivity[];
  isAdmin: boolean;
  nextActivityId: bigint;
}

export function makeElectorate(
  overrides: Partial<Electorate> & { id: bigint; name: string },
): Electorate {
  return {
    province: "Central",
    region: "Southern",
    seatType: SeatType.open,
    registeredVoters: 30_000n,
    supportLevel: SupportLevel.Undecided,
    campaignManager: "",
    notes: "",
    updatedAt: 0n,
    ...overrides,
  };
}

export function makeActivity(
  overrides: Partial<CampaignActivity> & {
    id: bigint;
    electorateId: bigint;
  },
): CampaignActivity {
  return {
    activityType: ActivityType.event,
    date: 1_700_000_000_000_000_000n,
    createdAt: 1_700_000_000_000_000_000n,
    description: "Campaign activity",
    ...overrides,
  };
}

export function createMockBackend(seed: Partial<MockBackendState> = {}): {
  backend: MockBackend;
  state: MockBackendState;
} {
  const state: MockBackendState = {
    electorates: seed.electorates ?? [],
    activities: seed.activities ?? [],
    isAdmin: seed.isAdmin ?? false,
    nextActivityId: seed.nextActivityId ?? 0n,
  };

  const backend: MockBackend = {
    async listElectorates() {
      return [...state.electorates];
    },
    async getElectorate(id) {
      return state.electorates.find((e) => e.id === id) ?? null;
    },
    async listActivities(electorateId) {
      return state.activities.filter((a) => a.electorateId === electorateId);
    },
    async getNationalSummary() {
      const provinces = new Set(state.electorates.map((e) => e.province));
      const levels = [
        SupportLevel.Strong,
        SupportLevel.Leaning,
        SupportLevel.Undecided,
        SupportLevel.Weak,
        SupportLevel.Opposed,
      ];
      return {
        totalElectorates: BigInt(state.electorates.length),
        totalProvinces: BigInt(provinces.size),
        totalRegisteredVoters: state.electorates.reduce(
          (sum, e) => sum + e.registeredVoters,
          0n,
        ),
        totalActivities: BigInt(state.activities.length),
        countsByProvince: [...provinces].map((province) => ({
          province,
          count: BigInt(
            state.electorates.filter((e) => e.province === province).length,
          ),
        })),
        countsBySupportLevel: levels.map((supportLevel) => ({
          supportLevel,
          count: BigInt(
            state.electorates.filter((e) => e.supportLevel === supportLevel)
              .length,
          ),
        })),
      };
    },
    async listRecentActivities(limit) {
      const sorted = [...state.activities].sort((a, b) =>
        a.createdAt === b.createdAt ? 0 : a.createdAt > b.createdAt ? -1 : 1,
      );
      return sorted.slice(0, Number(limit));
    },
    async isCallerAdmin() {
      return state.isAdmin;
    },
    async updateCampaignDetails(id, details) {
      const index = state.electorates.findIndex((e) => e.id === id);
      if (index === -1) return null;
      const updated: Electorate = {
        ...state.electorates[index],
        supportLevel: details.supportLevel,
        campaignManager: details.campaignManager,
        notes: details.notes,
        updatedAt: 1_800_000_000_000_000_000n,
      };
      state.electorates[index] = updated;
      return updated;
    },
    async addActivity(electorateId, input) {
      if (!state.electorates.some((e) => e.id === electorateId)) return null;
      const activity: CampaignActivity = {
        id: state.nextActivityId,
        electorateId,
        activityType: input.activityType,
        date: input.date,
        description: input.description,
        createdAt: 1_800_000_000_000_000_000n,
      };
      state.nextActivityId += 1n;
      state.activities.push(activity);
      return activity;
    },
  };

  return { backend, state };
}

export type { ActivityId };
