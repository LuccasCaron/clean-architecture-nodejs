import { ConfirmReadingUsecase } from "../../../src/usecases/confirm-reading/confirm-reading.usecase";
import { ReadingGateway } from "../../../src/domain/gateway/reading.gateway";
import {
  ReadingNotFoundError,
  DuplicateReadingError,
} from "../../../src/utils/errors/app-errors";

describe("ConfirmReadingUsecase", () => {
  let usecase: ConfirmReadingUsecase;
  let readingGateway: jest.Mocked<ReadingGateway>;

  beforeEach(() => {
    readingGateway = {
      checkExistReading: jest.fn(),
      save: jest.fn(),
      list: jest.fn(),
      update: jest.fn(),
    } as jest.Mocked<ReadingGateway>;

    usecase = ConfirmReadingUsecase.create(readingGateway);
  });

  it("should confirm reading successfully", async () => {
    readingGateway.update.mockResolvedValue("UPDATED");

    const inputDto = {
      readingId: "123",
      confirmed_value: 150.75,
    };

    const result = await usecase.execute(inputDto);

    expect(result).toEqual({ success: true });
    expect(readingGateway.update).toHaveBeenCalledWith("123", 150.75);
  });

  it("should throw ReadingNotFoundError if reading is not found", async () => {
    readingGateway.update.mockResolvedValue("NOT_FOUND");

    const inputDto = {
      readingId: "123",
      confirmed_value: 150.75,
    };

    await expect(usecase.execute(inputDto)).rejects.toThrow(
      ReadingNotFoundError
    );
  });

  it("should throw DuplicateReadingError if reading update results in duplicate", async () => {
    readingGateway.update.mockResolvedValue("DUPLICATE");

    const inputDto = {
      readingId: "123",
      confirmed_value: 150.75,
    };

    await expect(usecase.execute(inputDto)).rejects.toThrow(
      DuplicateReadingError
    );
  });
});
