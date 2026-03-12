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
  filterPresets: [
    {
      name: 'Standard Tracks',
      slug: 'standard-tracks',
      excludedAlbums: ['The Hunger Games'],
      excludedVariants: ['GUTS:spilled']
    },
    // Exclude hunger games songs and variants for the "Album Tracks Only"
    // preset, since these are not part of an album.
    {
      name: 'Album Tracks Only',
      slug: 'album-tracks-only',
      excludedAlbums: ['The Hunger Games'],
      excludedVariants: []
    }
  ]
};
