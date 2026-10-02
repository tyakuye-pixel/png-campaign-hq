import { createActor } from "@/backend";
import type {
  ElectorateId,
  NewActivity,
  UpdateCampaignDetails,
} from "@/lib/electorates";
import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const FIVE_MINUTES = 5 * 60 * 1000;
const ONE_MINUTE = 60 * 1000;

export const electorateKeys = {
  all: ["electorates"] as const,
  list: () => [...electorateKeys.all, "list"] as const,
  detail: (id: ElectorateId) =>
    [...electorateKeys.all, "detail", id.toString()] as const,
  activities: (id: ElectorateId) =>
    [...electorateKeys.all, "activities", id.toString()] as const,
  summary: () => ["national-summary"] as const,
  recentActivities: (limit: number) => ["recent-activities", limit] as const,
  isAdmin: () => ["is-admin"] as const,
};

export function useElectorates() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: electorateKeys.list(),
    queryFn: async () => {
      if (!actor) return [];
      return actor.listElectorates();
    },
    enabled: !!actor && !isFetching,
    staleTime: FIVE_MINUTES,
  });
}

export function useElectorate(id: ElectorateId | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: electorateKeys.detail(id ?? 0n),
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getElectorate(id);
    },
    enabled: !!actor && !isFetching && id !== null,
    staleTime: FIVE_MINUTES,
  });
}

export function useActivities(electorateId: ElectorateId | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: electorateKeys.activities(electorateId ?? 0n),
    queryFn: async () => {
      if (!actor || electorateId === null) return [];
      return actor.listActivities(electorateId);
    },
    enabled: !!actor && !isFetching && electorateId !== null,
    staleTime: ONE_MINUTE,
  });
}

export function useNationalSummary() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: electorateKeys.summary(),
    queryFn: async () => {
      if (!actor) return null;
      return actor.getNationalSummary();
    },
    enabled: !!actor && !isFetching,
    staleTime: FIVE_MINUTES,
  });
}

export function useRecentActivities(limit = 8) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: electorateKeys.recentActivities(limit),
    queryFn: async () => {
      if (!actor) return [];
      return actor.listRecentActivities(BigInt(limit));
    },
    enabled: !!actor && !isFetching,
    staleTime: ONE_MINUTE,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor(createActor);
  const { isAuthenticated } = useInternetIdentity();
  return useQuery({
    queryKey: electorateKeys.isAdmin(),
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: ONE_MINUTE,
  });
}

export function useUpdateCampaignDetails() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      id: ElectorateId;
      details: UpdateCampaignDetails;
    }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.updateCampaignDetails(args.id, args.details);
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: electorateKeys.all });
      void queryClient.invalidateQueries({
        queryKey: electorateKeys.summary(),
      });
      void queryClient.invalidateQueries({
        queryKey: electorateKeys.detail(variables.id),
      });
    },
    onError: (error) => {
      console.error("Failed to update campaign details", error);
    },
  });
}

export function useAddActivity() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      electorateId: ElectorateId;
      input: NewActivity;
    }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.addActivity(args.electorateId, args.input);
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: electorateKeys.activities(variables.electorateId),
      });
      void queryClient.invalidateQueries({ queryKey: electorateKeys.all });
      void queryClient.invalidateQueries({
        queryKey: electorateKeys.summary(),
      });
      void queryClient.invalidateQueries({ queryKey: ["recent-activities"] });
    },
    onError: (error) => {
      console.error("Failed to record activity", error);
    },
  });
}
