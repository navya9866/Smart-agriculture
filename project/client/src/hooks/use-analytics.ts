import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

function parseWithLogging<T>(schema: any, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useMarketTrends(cropId?: string) {
  return useQuery({
    queryKey: [api.marketTrends.list.path, cropId],
    queryFn: async () => {
      const url = new URL(api.marketTrends.list.path, window.location.origin);
      if (cropId) url.searchParams.append("cropId", cropId);
      
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch market trends");
      const data = await res.json();
      return parseWithLogging<any>(api.marketTrends.list.responses[200], data, "marketTrends.list");
    },
  });
}

export function useEnvironmentalLogs(cropId?: string) {
  return useQuery({
    queryKey: [api.environmentalLogs.list.path, cropId],
    queryFn: async () => {
      const url = new URL(api.environmentalLogs.list.path, window.location.origin);
      if (cropId) url.searchParams.append("cropId", cropId);
      
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch environmental logs");
      const data = await res.json();
      return parseWithLogging<any>(api.environmentalLogs.list.responses[200], data, "environmentalLogs.list");
    },
  });
}

export function useCropResources(cropId?: string) {
  return useQuery({
    queryKey: [api.cropResources.list.path, cropId],
    queryFn: async () => {
      const url = new URL(api.cropResources.list.path, window.location.origin);
      if (cropId) url.searchParams.append("cropId", cropId);
      
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch crop resources");
      const data = await res.json();
      return parseWithLogging<any>(api.cropResources.list.responses[200], data, "cropResources.list");
    },
  });
}

export function useLaborAvailability() {
  return useQuery({
    queryKey: [api.laborAvailability.list.path],
    queryFn: async () => {
      const res = await fetch(api.laborAvailability.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch labor availability");
      const data = await res.json();
      return parseWithLogging<any>(api.laborAvailability.list.responses[200], data, "laborAvailability.list");
    },
  });
}
