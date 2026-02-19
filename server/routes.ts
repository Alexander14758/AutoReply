import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";
import { botStatus, triggerBot } from "./telegram";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.comments.list.path, async (req, res) => {
    const allComments = await storage.getComments();
    res.json(allComments);
  });

  app.post(api.comments.create.path, async (req, res) => {
    try {
      const input = api.comments.create.input.parse(req.body);
      const comment = await storage.createComment(input);
      res.status(201).json(comment);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.delete(api.comments.delete.path, async (req, res) => {
    await storage.deleteComment(Number(req.params.id));
    res.status(204).end();
  });

  app.get(api.settings.list.path, async (req, res) => {
    const allSettings = await storage.getSettings();
    res.json(allSettings);
  });

  app.post(api.settings.update.path, async (req, res) => {
    try {
      const input = api.settings.update.input.parse(req.body);
      const setting = await storage.setSetting(input.key, input.value);
      res.json(setting);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
        });
      }
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.get(api.bot.status.path, async (req, res) => {
    res.json(botStatus());
  });

  app.post(api.bot.trigger.path, async (req, res) => {
    const result = await triggerBot();
    res.json(result);
  });

  return httpServer;
}
