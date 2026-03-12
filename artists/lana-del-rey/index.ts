import type { ArtistConfig } from '../../core/types';
import songs from './songs.json';
import { ALBUM_THEMES } from './themes';

export const LanaDelReyConfig: ArtistConfig = {
  // Must be unique across all artists, used for storage keys.
  id: 'lana-del-rey',
  // Display name for the artist.
  name: 'Lana Del Rey',
  songs,
  themes: ALBUM_THEMES,
  // Key of the default theme to use from the themes object.
  defaultThemeKey: 'Did You Know That There\'s a Tunnel Under Ocean Blvd',
  // Key for storing the sort session in localStorage. Should be unique across artists.
  storageKey: 'ldr-song-sorter-session',
  topSectionName: 'The Top 10',
  topSectionCount: 10,
  filterPresets: [
    {
      name: 'No Bonus Tracks',
      slug: 'no-bonus-tracks',
      excludedAlbums: [],
      excludedVariants: [
        'Born to Die:Deluxe',
        'Paradise:iTunes',
        'Ultraviolence:Deluxe',
      ]
    },
    {
      name: 'Standard Tracks',
      slug: 'standard-tracks',
      excludedAlbums: ['Other Songs', 'Lana Del Ray', 'Stove'],
      excludedVariants: [
        'Born to Die:Deluxe',
        'Paradise:iTunes',
        'Ultraviolence:Deluxe',
      ]
    },
    {
        name: 'Album Tracks Only',
        slug: 'album-tracks-only',
        excludedAlbums: ['Other Songs', 'Lana Del Ray'],
        excludedVariants: []
    }
  ]
};