import { z } from "zod";
import { MeasureType } from "../domain/entity/reading.domain";

export const uploadImageBodySchema = z.object({
  image: z
    .string()
    .refine(
      (data) => data.startsWith("data:image/") && data.includes(";base64,"),
      {
        message: "Invalid Base64 image string",
      }
    ),
  customer_code: z.string(),
  measure_datetime: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
    message: "Invalid datetime format",
  }),
  measure_type: z.enum([MeasureType.WATER, MeasureType.GAS]),
});

export const confirmReadingBodySchema = z.object({
  measure_uuid: z.string().uuid(),
  confirmed_value: z.number().positive(),
});
