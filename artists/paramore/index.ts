import { type ArtistConfig, STANDARD_VARIANT } from '../../core/types';
import songs from './songs.json';
import { ALBUM_THEMES } from './themes';

export const ParamoreConfig: ArtistConfig = {
  id: 'paramore',
  name: 'Paramore',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: 'This Is Why',
  storageKey: 'paramore-song-sorter-session',
  // Song type switches in the Filters panel; every song is exactly one.
  songTypes: [
    { label: 'Album tracks', variants: [STANDARD_VARIANT] },
    // The deluxe editions' new songs: O Star, Stuck On You and This Circle,
    // Stop This Song (Love Sick Melody), Escape Route and Native Tongue.
    { label: 'Deluxe', variants: ['Deluxe'] },
    // Soundtrack songs (Decode, I Caught Myself, Monster), the Singles Club
    // songs and Burning Down the House.
    { label: 'Singles', variants: ['Singles'] },
  ],
  topSectionName: 'The Top 10',
  topSectionCount: 10,
  seo: {
    description: 'Rank every Paramore song, from All We Know Is Falling and Riot! to Brand New Eyes, Paramore, After Laughter and This Is Why. Choose between two songs at a time to build your ultimate personal ranking.',
  },
};
