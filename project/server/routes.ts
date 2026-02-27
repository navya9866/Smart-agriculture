import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Seed Data function
  async function seedDatabase() {
    try {
      const existingCrops = await storage.getCrops();
      if (existingCrops.length === 0) {
        const crop1 = await storage.createCrop({
          name: "Wheat",
          growthDurationDays: 120,
          optimalTempMin: 15,
          optimalTempMax: 25,
          optimalHumidityMin: 50,
          optimalHumidityMax: 70,
          soilType: "Loam",
        });

        const crop2 = await storage.createCrop({
          name: "Rice",
          growthDurationDays: 150,
          optimalTempMin: 20,
          optimalTempMax: 30,
          optimalHumidityMin: 60,
          optimalHumidityMax: 80,
          soilType: "Clay Loam",
        });

        // Seed Resources
        await storage.createCropResource({
          cropId: crop1.id,
          resourceType: "fertilizer",
          name: "Urea 46% N",
          description: "Nitrogen fertilizer for vegetative growth",
          applicationRate: "50 kg/ha",
        });

        await storage.createCropResource({
          cropId: crop1.id,
          resourceType: "pesticide",
          name: "Chlorpyrifos",
          description: "Controls aphids and worms",
          applicationRate: "1 L/ha",
        });

        // Seed Market Trends
        const months = ["01", "02", "03", "04", "05"];
        for (let i = 0; i < months.length; i++) {
          await storage.createMarketTrend({
            cropId: crop1.id,
            date: `2024-${months[i]}-01`,
            pricePerTon: 200 + Math.floor(Math.random() * 50),
            marketName: "Central Market",
          });
          
          await storage.createEnvironmentalLog({
            cropId: crop1.id,
            date: `2024-${months[i]}-01`,
            temperature: 18 + Math.floor(Math.random() * 5),
            humidity: 55 + Math.floor(Math.random() * 10),
            growthStage: i < 2 ? "Vegetative" : "Reproductive",
          });

          await storage.createMarketTrend({
            cropId: crop2.id,
            date: `2024-${months[i]}-01`,
            pricePerTon: 300 + Math.floor(Math.random() * 70),
            marketName: "South Market",
          });
          
          await storage.createEnvironmentalLog({
            cropId: crop2.id,
            date: `2024-${months[i]}-01`,
            temperature: 22 + Math.floor(Math.random() * 6),
            humidity: 65 + Math.floor(Math.random() * 15),
            growthStage: i < 2 ? "Vegetative" : "Reproductive",
          });
        }

        // Seed Labor
        await storage.createLaborAvailability({
          region: "North Plains",
          date: "2024-05-01",
          availableWorkers: 150,
          dailyWage: 40,
        });

        await storage.createLaborAvailability({
          region: "South Valley",
          date: "2024-05-01",
          availableWorkers: 85,
          dailyWage: 45,
        });
        
        await storage.createLaborAvailability({
          region: "East Hills",
          date: "2024-05-01",
          availableWorkers: 210,
          dailyWage: 35,
        });
      }
    } catch (error) {
      console.error("Error seeding database:", error);
    }
  }

  // Run seed
  seedDatabase();

  app.get(api.crops.list.path, async (req, res) => {
    const crops = await storage.getCrops();
    res.json(crops);
  });

  app.get(api.crops.get.path, async (req, res) => {
    const crop = await storage.getCrop(Number(req.params.id));
    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }
    res.json(crop);
  });

  app.post(api.crops.create.path, async (req, res) => {
    try {
      const input = api.crops.create.input.parse(req.body);
      const crop = await storage.createCrop(input);
      res.status(201).json(crop);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.cropResources.list.path, async (req, res) => {
    const cropId = req.query.cropId ? Number(req.query.cropId) : undefined;
    const resources = await storage.getCropResources(cropId);
    res.json(resources);
  });

  app.get(api.marketTrends.list.path, async (req, res) => {
    const cropId = req.query.cropId ? Number(req.query.cropId) : undefined;
    const trends = await storage.getMarketTrends(cropId);
    res.json(trends);
  });

  app.get(api.environmentalLogs.list.path, async (req, res) => {
    const cropId = req.query.cropId ? Number(req.query.cropId) : undefined;
    const logs = await storage.getEnvironmentalLogs(cropId);
    res.json(logs);
  });

  app.get(api.laborAvailability.list.path, async (req, res) => {
    const labor = await storage.getLaborAvailability();
    res.json(labor);
  });

  return httpServer;
}
