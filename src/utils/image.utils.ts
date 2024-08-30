import fs from "fs";
import path from "path";

const DIRECTORY_PATH = "/app/temp"; // Diretório dentro do contêiner onde o volume é montado

export function saveBase64Image(
  base64Data: string,
  fileName: string
): { filePath: string; fileUrl: string } {
  const base64Str = base64Data.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Str, "base64");

  if (!fs.existsSync(DIRECTORY_PATH)) {
    fs.mkdirSync(DIRECTORY_PATH, { recursive: true });
  }

  const filePath = path.join(DIRECTORY_PATH, fileName);

  fs.writeFileSync(filePath, buffer);

  const fileUrl = `http://localhost:3000/temp/${fileName}`;

  return { filePath, fileUrl };
}
