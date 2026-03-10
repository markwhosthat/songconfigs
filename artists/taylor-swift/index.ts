import type { ArtistConfig } from '../../core/types';
import songs from './songs.json';
import { ALBUM_THEMES } from './themes';

export const TaylorSwiftConfig: ArtistConfig = {
  // Must be unique across all artists, used for storage keys.
  id: 'taylor-swift',
  // Display name for the artist.
  name: 'Taylor Swift',
  songs,
  themes: ALBUM_THEMES,
  // Key of the default theme to use from the themes object.
  defaultThemeKey: 'Midnights',
  // Key for storing the sort session in localStorage. Should be unique across artists.
  storageKey: 'ts-song-sorter-session',
  // Optional: If provided, a "Top Picks" section will be shown at the top of the results 
  // with this name and containing this many songs.
  topSectionName: 'The Top 13',
  topSectionCount: 13,
  filterPresets: [
    {
      name: 'No Extra Tracks',
      slug: 'no-extra-tracks',
      excludedAlbums: [],
      excludedVariants: [
        'Midnights:Remix',
        'The Life Of A Showgirl:Extras'
      ]
    },
    {
      name: 'Standard Tracks',
      slug: 'standard-tracks',
      excludedAlbums: ['Other Songs'],
      excludedVariants: [
        'Taylor Swift:Deluxe',
        'Fearless:Deluxe', 'Fearless:Soundtrack', 'Fearless:From the Vault',
        'Speak Now:Deluxe', 'Speak Now:From the Vault', 'Speak Now:Bonus',
        'Red:Deluxe', 'Red:From the Vault',
        '1989:Deluxe', '1989:From the Vault', '1989:Soundtrack',
        'Lover:Bonus',
        'Folklore:Deluxe',
        'Evermore:Deluxe',
        'Midnights:3am Edition', 'Midnights:Bonus', 'Midnights:Deluxe', 'Midnights:From the Vault', 'Midnights:Remix',
        'The Tortured Poets Department:The Anthology',
        'The Life Of A Showgirl:Extras'
      ]
    }
  ]
};
