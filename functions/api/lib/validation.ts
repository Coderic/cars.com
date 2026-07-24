import { z } from "zod";

export const vehicleStatusSchema = z.enum(["available", "reserved", "sold"]);

export const vehicleInputSchema = z.object({
  codigo: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/, "código inválido"),
  make: z.string().min(1).max(80),
  model: z.string().min(1).max(80),
  year: z.number().int().min(1990).max(2030),
  price: z.number().int().min(0),
  mileage: z.number().int().min(0),
  fuel_type: z.string().min(1).max(40),
  transmission: z.string().min(1).max(40),
  body_type: z.string().min(1).max(40),
  color: z.string().min(1).max(60),
  description: z.string().min(1).max(5000),
  image_url: z.string().min(1).max(500),
  images: z.array(z.string().min(1).max(500)).default([]),
  status: vehicleStatusSchema.default("available"),
  featured: z.boolean().default(false),
});

export const vehiclePatchSchema = vehicleInputSchema.partial();

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const mediaDeleteSchema = z.object({
  key: z.string().min(1),
});

export type VehicleInput = z.infer<typeof vehicleInputSchema>;
export type VehiclePatch = z.infer<typeof vehiclePatchSchema>;
