export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ReadingAlreadyExistsError extends AppError {
  constructor() {
    super("Leitura do mês já realizada.", 409);
  }
}

export class InvalidData extends AppError {
  constructor() {
    super("Os dados fornecidos no corpo da requisição são inválidos.", 400);
  }
}

export class ContentGenerationError extends AppError {
  constructor() {
    super("Falha ao gerar conteúdo da imagem", 500);
  }
}

export class NumberExtractionError extends AppError {
  constructor() {
    super("Falha ao extrair número do conteúdo da imagem.", 500);
  }
}

export class ReadingNotFoundError extends AppError {
  constructor() {
    super("Leitura não encontrada.", 404);
  }
}

export class DuplicateReadingError extends AppError {
  constructor() {
    super("Leitura do mês já realizda.", 409);
  }
}
export class ReadingsNotFound extends AppError {
  constructor() {
    super("Nenhuma leitura encontrada.", 404);
  }
}
