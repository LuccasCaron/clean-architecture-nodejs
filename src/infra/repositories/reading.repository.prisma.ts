import { PrismaClient } from "@prisma/client";
import {
  ReadingGateway,
  UpdateStatus,
} from "../../domain/gateway/reading.gateway";
import { Reading, MeasureType } from "../../domain/entity/reading.domain";

export class ReadingRepositoryPrisma implements ReadingGateway {
  private constructor(private readonly prismaClient: PrismaClient) {}

  public static create(prismaClient: PrismaClient) {
    return new ReadingRepositoryPrisma(prismaClient);
  }

  public async save(reading: Reading): Promise<void> {
    await this.prismaClient.reading.create({
      data: {
        id: reading.id,
        customerCode: reading.customer_code,
        measureDatetime: reading.measure_datetime,
        measureType: reading.measure_type,
        value: reading.value,
        imageUrl: reading.image_url,
        confirmed: reading.confirmed,
        createdAt: reading.createAt,
        updatedAt: reading.updatedAt,
      },
    });
  }

  public async list(
    customerCode: string,
    measureType?: string
  ): Promise<Reading[]> {
    const normalizedMeasureType = measureType?.toUpperCase() as MeasureType;

    if (
      measureType &&
      !Object.values(MeasureType).includes(normalizedMeasureType)
    ) {
      throw new Error("INVALID_TYPE");
    }

    const whereClause: any = {
      customerCode,
    };

    if (normalizedMeasureType) {
      whereClause.measureType = normalizedMeasureType;
    }

    const readings = await this.prismaClient.reading.findMany({
      where: whereClause,
    });

    return readings.map((reading) => {
      const domainMeasureType: MeasureType = reading.measureType as MeasureType;

      return Reading.with({
        id: reading.id,
        customer_code: reading.customerCode,
        measure_datetime: reading.measureDatetime,
        measure_type: domainMeasureType,
        value: reading.value,
        image_url: reading.imageUrl,
        confirmed: reading.confirmed,
        createAt: reading.createdAt,
        updatedAt: reading.updatedAt,
      });
    });
  }

  public async update(
    readingId: string,
    confirmedValue: number
  ): Promise<UpdateStatus> {
    const reading = await this.prismaClient.reading.findUnique({
      where: { id: readingId },
    });

    if (!reading) {
      return "NOT_FOUND";
    }

    if (reading.confirmed) {
      return "DUPLICATE";
    }

    await this.prismaClient.reading.update({
      where: { id: readingId },
      data: {
        value: confirmedValue,
        confirmed: true,
      },
    });

    return "UPDATED";
  }

  public async checkExistReading(
    customer_code: string,
    measure_type: MeasureType,
    measureDateTime: Date
  ): Promise<boolean> {
    const date = new Date(measureDateTime);

    const existingReading = await this.prismaClient.reading.findFirst({
      where: {
        customerCode: customer_code,
        measureType: measure_type,
        measureDatetime: {
          gte: new Date(date.getFullYear(), date.getMonth(), 1),
          lt: new Date(date.getFullYear(), date.getMonth() + 1, 1),
        },
      },
    });

    return existingReading !== null;
  }
}
