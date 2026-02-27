import { z } from "zod";
import {
  crops, cropResources, marketTrends, environmentalLogs, laborAvailability,
  insertCropSchema, insertCropResourceSchema, insertMarketTrendSchema, insertEnvironmentalLogSchema, insertLaborAvailabilitySchema
} from "./schema";

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  crops: {
    list: {
      method: "GET" as const,
      path: "/api/crops" as const,
      responses: {
        200: z.array(z.custom<typeof crops.$inferSelect>()),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/crops/:id" as const,
      responses: {
        200: z.custom<typeof crops.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/crops" as const,
      input: insertCropSchema,
      responses: {
        201: z.custom<typeof crops.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  cropResources: {
    list: {
      method: "GET" as const,
      path: "/api/crop-resources" as const,
      input: z.object({ cropId: z.string().optional() }).optional(),
      responses: {
        200: z.array(z.custom<typeof cropResources.$inferSelect>()),
      },
    },
  },
  marketTrends: {
    list: {
      method: "GET" as const,
      path: "/api/market-trends" as const,
      input: z.object({ cropId: z.string().optional() }).optional(),
      responses: {
        200: z.array(z.custom<typeof marketTrends.$inferSelect>()),
      },
    },
  },
  environmentalLogs: {
    list: {
      method: "GET" as const,
      path: "/api/environmental-logs" as const,
      input: z.object({ cropId: z.string().optional() }).optional(),
      responses: {
        200: z.array(z.custom<typeof environmentalLogs.$inferSelect>()),
      },
    },
  },
  laborAvailability: {
    list: {
      method: "GET" as const,
      path: "/api/labor" as const,
      responses: {
        200: z.array(z.custom<typeof laborAvailability.$inferSelect>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type CropResponse = z.infer<typeof api.crops.create.responses[201]>;
export type CropsListResponse = z.infer<typeof api.crops.list.responses[200]>;
