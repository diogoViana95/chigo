export type ProductImage = { key: string; url: string; name?: string };

export function parseProductImages(value: unknown): ProductImage[] {
  let parsed: unknown = value;
  if (typeof value === 'string') {
    try { parsed = JSON.parse(value); } catch { return []; }
  }
  if (!Array.isArray(parsed)) return [];
  return parsed.flatMap((item): ProductImage[] => {
    if (typeof item === 'string' && item.startsWith('https://')) return [{ key: '', url: item }];
    if (typeof item === 'object' && item !== null && 'url' in item && typeof item.url === 'string' && item.url.startsWith('https://')) {
      return [{ key: 'key' in item && typeof item.key === 'string' ? item.key : '', url: item.url, name: 'name' in item && typeof item.name === 'string' ? item.name : undefined }];
    }
    return [];
  });
}
