import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const crops = pgTable("crops", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  growthDurationDays: integer("growth_duration_days").notNull(),
  optimalTempMin: integer("optimal_temp_min").notNull(),
  optimalTempMax: integer("optimal_temp_max").notNull(),
  optimalHumidityMin: integer("optimal_humidity_min").notNull(),
  optimalHumidityMax: integer("optimal_humidity_max").notNull(),
  soilType: text("soil_type").notNull(),
});

export const cropResources = pgTable("crop_resources", {
  id: serial("id").primaryKey(),
  cropId: integer("crop_id").notNull(),
  resourceType: text("resource_type").notNull(), // 'pesticide', 'fertilizer', 'seed'
  name: text("name").notNull(),
  description: text("description").notNull(),
  applicationRate: text("application_rate").notNull(),
});

export const marketTrends = pgTable("market_trends", {
  id: serial("id").primaryKey(),
  cropId: integer("crop_id").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD
  pricePerTon: integer("price_per_ton").notNull(),
  marketName: text("market_name").notNull(),
});

export const environmentalLogs = pgTable("environmental_logs", {
  id: serial("id").primaryKey(),
  cropId: integer("crop_id").notNull(),
  date: text("date").notNull(),
  temperature: integer("temperature").notNull(),
  humidity: integer("humidity").notNull(),
  growthStage: text("growth_stage").notNull(),
});

export const laborAvailability = pgTable("labor_availability", {
  id: serial("id").primaryKey(),
  region: text("region").notNull(),
  date: text("date").notNull(),
  availableWorkers: integer("available_workers").notNull(),
  dailyWage: integer("daily_wage").notNull(),
});

export const insertCropSchema = createInsertSchema(crops).omit({ id: true });
export const insertCropResourceSchema = createInsertSchema(cropResources).omit({ id: true });
export const insertMarketTrendSchema = createInsertSchema(marketTrends).omit({ id: true });
export const insertEnvironmentalLogSchema = createInsertSchema(environmentalLogs).omit({ id: true });
export const insertLaborAvailabilitySchema = createInsertSchema(laborAvailability).omit({ id: true });

export type Crop = typeof crops.$inferSelect;
export type InsertCrop = z.infer<typeof insertCropSchema>;

export type CropResource = typeof cropResources.$inferSelect;
export type InsertCropResource = z.infer<typeof insertCropResourceSchema>;

export type MarketTrend = typeof marketTrends.$inferSelect;
export type InsertMarketTrend = z.infer<typeof insertMarketTrendSchema>;

export type EnvironmentalLog = typeof environmentalLogs.$inferSelect;
export type InsertEnvironmentalLog = z.infer<typeof insertEnvironmentalLogSchema>;

export type LaborAvailability = typeof laborAvailability.$inferSelect;
export type InsertLaborAvailability = z.infer<typeof insertLaborAvailabilitySchema>;
