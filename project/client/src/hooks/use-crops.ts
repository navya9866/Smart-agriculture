import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertCrop } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

function parseWithLogging<T>(schema: any, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useCrops() {
  return useQuery({
    queryKey: [api.crops.list.path],
    queryFn: async () => {
      const res = await fetch(api.crops.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch crops");
      const data = await res.json();
      return parseWithLogging<any>(api.crops.list.responses[200], data, "crops.list");
    },
  });
}

export function useCrop(id: number) {
  return useQuery({
    queryKey: [api.crops.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.crops.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch crop");
      const data = await res.json();
      return parseWithLogging<any>(api.crops.get.responses[200], data, `crops.get(${id})`);
    },
    enabled: !!id,
  });
}

export function useCreateCrop() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertCrop) => {
      const validated = api.crops.create.input.parse(data);
      const res = await fetch(api.crops.create.path, {
        method: api.crops.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.crops.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create crop");
      }
      return parseWithLogging<any>(api.crops.create.responses[201], await res.json(), "crops.create");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.crops.list.path] });
      toast({ title: "Success", description: "Crop created successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}
