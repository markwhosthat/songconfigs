import type { ArtistConfig } from '../../core/types';
import songs from './songs.json';
import { ALBUM_THEMES } from './themes';

export const TaylorSwiftConfig: ArtistConfig = {
  id: 'taylor-swift',
  name: 'Taylor Swift',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: 'Midnights',
  storageKey: 'ts-song-sorter-session',
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
