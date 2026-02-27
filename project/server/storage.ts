import { db } from "./db";
import {
  crops, cropResources, marketTrends, environmentalLogs, laborAvailability,
  type Crop, type InsertCrop,
  type CropResource, type InsertCropResource,
  type MarketTrend, type InsertMarketTrend,
  type EnvironmentalLog, type InsertEnvironmentalLog,
  type LaborAvailability, type InsertLaborAvailability
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getCrops(): Promise<Crop[]>;
  getCrop(id: number): Promise<Crop | undefined>;
  createCrop(crop: InsertCrop): Promise<Crop>;

  getCropResources(cropId?: number): Promise<CropResource[]>;
  
  getMarketTrends(cropId?: number): Promise<MarketTrend[]>;
  
  getEnvironmentalLogs(cropId?: number): Promise<EnvironmentalLog[]>;
  
  getLaborAvailability(): Promise<LaborAvailability[]>;
  
  createCropResource(resource: InsertCropResource): Promise<CropResource>;
  createMarketTrend(trend: InsertMarketTrend): Promise<MarketTrend>;
  createEnvironmentalLog(log: InsertEnvironmentalLog): Promise<EnvironmentalLog>;
  createLaborAvailability(labor: InsertLaborAvailability): Promise<LaborAvailability>;
}

export class DatabaseStorage implements IStorage {
  async getCrops(): Promise<Crop[]> {
    return await db.select().from(crops);
  }

  async getCrop(id: number): Promise<Crop | undefined> {
    const [crop] = await db.select().from(crops).where(eq(crops.id, id));
    return crop;
  }

  async createCrop(insertCrop: InsertCrop): Promise<Crop> {
    const [crop] = await db.insert(crops).values(insertCrop).returning();
    return crop;
  }

  async getCropResources(cropId?: number): Promise<CropResource[]> {
    if (cropId !== undefined && !isNaN(cropId)) {
      return await db.select().from(cropResources).where(eq(cropResources.cropId, cropId));
    }
    return await db.select().from(cropResources);
  }

  async getMarketTrends(cropId?: number): Promise<MarketTrend[]> {
    if (cropId !== undefined && !isNaN(cropId)) {
      return await db.select().from(marketTrends).where(eq(marketTrends.cropId, cropId));
    }
    return await db.select().from(marketTrends);
  }

  async getEnvironmentalLogs(cropId?: number): Promise<EnvironmentalLog[]> {
    if (cropId !== undefined && !isNaN(cropId)) {
      return await db.select().from(environmentalLogs).where(eq(environmentalLogs.cropId, cropId));
    }
    return await db.select().from(environmentalLogs);
  }

  async getLaborAvailability(): Promise<LaborAvailability[]> {
    return await db.select().from(laborAvailability);
  }

  async createCropResource(resource: InsertCropResource): Promise<CropResource> {
    const [res] = await db.insert(cropResources).values(resource).returning();
    return res;
  }

  async createMarketTrend(trend: InsertMarketTrend): Promise<MarketTrend> {
    const [res] = await db.insert(marketTrends).values(trend).returning();
    return res;
  }

  async createEnvironmentalLog(log: InsertEnvironmentalLog): Promise<EnvironmentalLog> {
    const [res] = await db.insert(environmentalLogs).values(log).returning();
    return res;
  }

  async createLaborAvailability(labor: InsertLaborAvailability): Promise<LaborAvailability> {
    const [res] = await db.insert(laborAvailability).values(labor).returning();
    return res;
  }
}

export const storage = new DatabaseStorage();
