import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap { return [{ url:'https://chigo.pt', lastModified:new Date(), changeFrequency:'weekly', priority:1 }, {url:'https://chigo.pt/#collection',lastModified:new Date(),changeFrequency:'weekly',priority:.8}]; }
