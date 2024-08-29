import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:3000/temp";

export function saveBase64Image(
  base64Data: string,
  directory: string,
  fileName: string
): { filePath: string; fileUrl: string } {
  const base64Str = base64Data.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Str, "base64");

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  const filePath = path.join(directory, fileName);

  fs.writeFileSync(filePath, buffer);

  const fileUrl = `${BASE_URL}/${fileName}`;

  return { filePath, fileUrl };
}
