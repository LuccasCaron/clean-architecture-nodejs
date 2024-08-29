import {
  GetReadingUsecase,
  GetReadingInputDto,
  GetReadingOutputDto,
} from "../../../src/usecases/get-readings/get-readings.usecase";
import { ReadingGateway } from "../../../src/domain/gateway/reading.gateway";
import {
  Reading,
  MeasureType,
} from "../../../src/domain/entity/reading.domain";
import { ReadingsNotFound } from "../../../src/utils/errors/app-errors";

describe("GetReadingUsecase", () => {
  let usecase: GetReadingUsecase;
  let readingGateway: jest.Mocked<ReadingGateway>;

  beforeEach(() => {
    readingGateway = {
      checkExistReading: jest.fn(),
      save: jest.fn(),
      list: jest.fn(),
      update: jest.fn(),
    } as jest.Mocked<ReadingGateway>;

    usecase = GetReadingUsecase.create(readingGateway);
  });

  it("should return readings for a customer code", async () => {
    const mockReadings: Reading[] = [
      Reading.create(
        "ABC123",
        MeasureType.WATER,
        100,
        "http://localhost/image1.jpeg"
      ),
      Reading.create(
        "ABC123",
        MeasureType.GAS,
        200,
        "http://localhost/image2.jpeg"
      ),
    ];

    readingGateway.list.mockResolvedValue(mockReadings);

    const inputDto: GetReadingInputDto = {
      customer_code: "ABC123",
    };

    const result: GetReadingOutputDto = await usecase.execute(inputDto);

    expect(result).toEqual({
      customer_code: "ABC123",
      measures: mockReadings,
    });
    expect(readingGateway.list).toHaveBeenCalledWith("ABC123", undefined);
  });

  it("should return readings for a customer code and measure type", async () => {
    const mockReadings: Reading[] = [
      Reading.create(
        "ABC123",
        MeasureType.WATER,
        100,
        "http://localhost/image1.jpeg"
      ),
    ];

    readingGateway.list.mockResolvedValue(mockReadings);

    const inputDto: GetReadingInputDto = {
      customer_code: "ABC123",
      measure_type: MeasureType.WATER,
    };

    const result: GetReadingOutputDto = await usecase.execute(inputDto);

    expect(result).toEqual({
      customer_code: "ABC123",
      measures: mockReadings,
    });
    expect(readingGateway.list).toHaveBeenCalledWith(
      "ABC123",
      MeasureType.WATER
    );
  });

  it("should throw ReadingsNotFound if no readings are found", async () => {
    readingGateway.list.mockResolvedValue([]);

    const inputDto: GetReadingInputDto = {
      customer_code: "ABC123",
    };

    await expect(usecase.execute(inputDto)).rejects.toThrow(ReadingsNotFound);
    expect(readingGateway.list).toHaveBeenCalledWith("ABC123", undefined);
  });

  it("should throw ReadingsNotFound if the list returns null", async () => {
    readingGateway.list.mockResolvedValue(null);

    const inputDto: GetReadingInputDto = {
      customer_code: "ABC123",
    };

    await expect(usecase.execute(inputDto)).rejects.toThrow(ReadingsNotFound);
    expect(readingGateway.list).toHaveBeenCalledWith("ABC123", undefined);
  });
});
