import { CreateReadingUsecase } from "../../../src/usecases/create-reading/create-reading.usecase";
import { ReadingGateway } from "../../../src/domain/gateway/reading.gateway";
import { IGeminiReader } from "../../../src/services/gemini";
import {
  ContentGenerationError,
  NumberExtractionError,
  ReadingAlreadyExistsError,
} from "../../../src/utils/errors/app-errors";
import { Reading } from "../../../src/domain/entity/reading.domain";

jest.mock("../../../src/utils/image.utils", () => ({
  saveBase64Image: jest.fn().mockReturnValue({
    filePath: "temp_image.jpeg",
    fileUrl: "http://localhost/temp_image.jpeg",
  }),
}));

describe("CreateReadingUsecase", () => {
  let usecase: CreateReadingUsecase;
  let readingGateway: jest.Mocked<ReadingGateway>;
  let geminiService: jest.Mocked<IGeminiReader>;

  beforeEach(() => {
    readingGateway = {
      checkExistReading: jest.fn(),
      save: jest.fn(),
      list: jest.fn(),
      update: jest.fn(),
    } as jest.Mocked<ReadingGateway>;

    geminiService = {
      uploadImage: jest.fn().mockResolvedValue({
        name: "image_name.jpeg",
        mimeType: "image/jpeg",
        sizeBytes: 1234,
        createTime: "2023-08-29T12:34:56Z",
        updateTime: "2023-08-29T12:34:56Z",
        uri: "http://mock.uri",
      }),
      getFileMetadata: jest.fn().mockResolvedValue({
        name: "image_name.jpeg",
        mimeType: "image/jpeg",
        sizeBytes: 1234,
        createTime: "2023-08-29T12:34:56Z",
        updateTime: "2023-08-29T12:34:56Z",
        uri: "http://mock.uri",
      }),
      generateContent: jest.fn().mockResolvedValue("Reading value: 123.45"),
    } as jest.Mocked<IGeminiReader>;

    usecase = CreateReadingUsecase.create(readingGateway, geminiService);
  });

  it("should create a new reading successfully", async () => {
    readingGateway.checkExistReading.mockResolvedValue(false);

    const inputDto = {
      customer_code: "ABC123",
      measure_type: "electricity" as any,
      measure_datetime: new Date(),
      image_base64: "data:image/jpeg;base64,...",
    };

    const result = await usecase.execute(inputDto);

    expect(result).toEqual({
      id: expect.any(String),
      value: 123.45,
      image_url: "http://localhost/temp_image.jpeg",
    });
    expect(readingGateway.save).toHaveBeenCalledWith(expect.any(Reading));
  });

  it("should throw ReadingAlreadyExistsError if reading already exists", async () => {
    readingGateway.checkExistReading.mockResolvedValue(true);

    const inputDto = {
      customer_code: "ABC123",
      measure_type: "electricity" as any,
      measure_datetime: new Date(),
      image_base64: "data:image/jpeg;base64,...",
    };

    await expect(usecase.execute(inputDto)).rejects.toThrow(
      ReadingAlreadyExistsError
    );
  });

  it("should throw ContentGenerationError if content generation fails", async () => {
    readingGateway.checkExistReading.mockResolvedValue(false);
    geminiService.uploadImage.mockResolvedValue({
      name: "image_name.jpeg",
      mimeType: "image/jpeg",
      sizeBytes: "1234",
      createTime: "2023-08-29T12:34:56Z",
      updateTime: "2023-08-29T12:34:56Z",
      uri: "http://mock.uri",
      expirationTime: "2023-09-29T12:34:56Z",
      sha256Hash: "mockSha256HashValue",
      state: "active" as any,
    });

    geminiService.generateContent.mockResolvedValue("");

    const inputDto = {
      customer_code: "ABC123",
      measure_type: "electricity" as any,
      measure_datetime: new Date(),
      image_base64: "data:image/jpeg;base64,...",
    };

    await expect(usecase.execute(inputDto)).rejects.toThrow(
      ContentGenerationError
    );
  });

  it("should throw NumberExtractionError if no number is extracted from content", async () => {
    readingGateway.checkExistReading.mockResolvedValue(false);
    geminiService.uploadImage.mockResolvedValue({
      name: "image_name.jpeg",
      mimeType: "image/jpeg",
      sizeBytes: "1234",
      createTime: "2023-08-29T12:34:56Z",
      updateTime: "2023-08-29T12:34:56Z",
      uri: "http://mock.uri",
      expirationTime: "2023-09-29T12:34:56Z",
      sha256Hash: "mockSha256HashValue",
      state: "active" as any,
    });

    geminiService.generateContent.mockResolvedValue("No numbers here");

    const inputDto = {
      customer_code: "ABC123",
      measure_type: "electricity" as any,
      measure_datetime: new Date(),
      image_base64: "data:image/jpeg;base64,...",
    };

    await expect(usecase.execute(inputDto)).rejects.toThrow(
      NumberExtractionError
    );
  });
});
