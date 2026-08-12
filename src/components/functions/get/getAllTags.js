import { API_URL, apiEndpoints } from '../../../config/api';

let cachedTags = null;
let cacheExpiresAt = 0;
let pendingRequest = null;

export const invalidateTagsCache = () => {
  cachedTags = null;
  cacheExpiresAt = 0;
};

export const getAllTags = async ({ force = false } = {}) => {
  const now = Date.now();
  if (!force && cachedTags && now < cacheExpiresAt) return cachedTags;
  if (pendingRequest) return pendingRequest;

  pendingRequest = fetch(`${API_URL}${apiEndpoints.tags}`, { cache: 'no-store' })
    .then(async (response) => {
      if (!response.ok) throw new Error('Error al cargar tags');
      const tags = await response.json();
      const uniqueTags = Array.from(
        new Map((tags || []).map((tag) => [tag._id, tag])).values(),
      );
      cachedTags = uniqueTags;
      cacheExpiresAt = Date.now() + 5000;
      return uniqueTags;
    })
    .finally(() => {
      pendingRequest = null;
    });

  return pendingRequest;
};
