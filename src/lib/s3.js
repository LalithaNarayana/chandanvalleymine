import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const region = process.env.AWS_REGION || "SIN";
const bucketName = process.env.AWS_BUCKET_NAME;

const s3Client = new S3Client({
  region: region,
  endpoint: "https://sin1.contabostorage.com",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

export async function uploadToS3(fileBuffer, fileName, mimeType) {
  const uploadParams = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimeType,
    ACL: "public-read",
  };

  await s3Client.send(new PutObjectCommand(uploadParams));

  // Construct URL
  return `https://sin1.contabostorage.com/${bucketName}/${fileName}`;
}

export async function deleteFromS3(fileKey) {
  // If the fileKey is a full S3 URL, extract the actual file key
  let key = fileKey;
  const bucketPrefix = `https://sin1.contabostorage.com/${bucketName}/`;
  if (fileKey.startsWith(bucketPrefix)) {
    key = fileKey.replace(bucketPrefix, "");
  }

  const deleteParams = {
    Bucket: bucketName,
    Key: key,
  };

  await s3Client.send(new DeleteObjectCommand(deleteParams));
}
