import { api } from '@/lib/api-client';

type LogoSignatureResponse = {
  timestamp: number;
  signature: string;
  folder: string;
  publicId: string;
  cloudName: string;
  apiKey: string;
};

type LogoUploadResult = {
  url: string;
  publicId: string;
};

export async function uploadStudioLogo(file: File): Promise<LogoUploadResult> {
  if (file.type !== 'image/png') {
    throw new Error('Logo must be a PNG file.');
  }

  const signature = (await api.post('studios/logo/upload-signature', {})) as LogoSignatureResponse;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', signature.apiKey);
  formData.append('timestamp', `${signature.timestamp}`);
  formData.append('signature', signature.signature);
  formData.append('folder', signature.folder);
  formData.append('public_id', signature.publicId);
  formData.append('overwrite', 'true');

  const res = await fetch(`https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Logo upload failed (${res.status}): ${body}`);
  }

  const data = await res.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
}
