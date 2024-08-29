import { MeasureType, Reading } from "../entity/reading.domain";

export type UpdateStatus = "NOT_FOUND" | "DUPLICATE" | "UPDATED";

export interface ReadingGateway {
  save(reading: Reading): Promise<void>;
  list(customerCode: string, measureType?: string): Promise<Reading[] | null>;
  update(readingId: string, confirmedValue: number): Promise<UpdateStatus>;
  checkExistReading(
    customer_code: string,
    measure_type: MeasureType,
    measureDateTime: Date
  ): Promise<boolean>;
}
