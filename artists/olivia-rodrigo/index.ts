import type { ArtistConfig } from '../../core/types';
import songs from './songs.json';
import { ALBUM_THEMES } from './themes';

export const OliviaRodrigoConfig: ArtistConfig = {
  id: 'olivia-rodrigo',
  name: 'Olivia Rodrigo',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: 'SOUR',
  storageKey: 'or-song-sorter-session',
  topSectionName: 'The Top Picks',
  topSectionCount: 10,
  filterPresets: [
    {
      name: 'Standard Tracks',
      slug: 'standard-tracks',
      excludedAlbums: ['The Hunger Games'],
      excludedVariants: ['GUTS:spilled']
    },
    {
      name: 'Album Tracks Only',
      slug: 'album-tracks-only',
      excludedAlbums: ['The Hunger Games'],
      excludedVariants: []
    }
  ]
};
