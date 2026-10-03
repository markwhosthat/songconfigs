import { type ArtistConfig, STANDARD_VARIANT } from '../../core/types';
import songs from './songs.json';
import { ALBUM_THEMES } from './themes';

export const TheWeekndConfig: ArtistConfig = {
  id: 'the-weeknd',
  name: 'The Weeknd',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: 'Starboy',
  storageKey: 'tw-song-sorter-session',
  // Song type switches in the Filters panel; every song is exactly one.
  songTypes: [
    { label: 'Album tracks', variants: [STANDARD_VARIANT] },
    { label: 'Deluxe', variants: ['Deluxe'] },
    { label: 'Bonus', variants: ['Bonus'] },
    { label: 'Remix', variants: ['Remix'] },
    { label: 'Singles', variants: ['Singles'] },
    { label: 'Soundtrack', variants: ['Soundtrack'] },
    { label: 'Features', variants: ['Features'] },
  ],
  // Songs where he is a featured guest rather than a main artist.
  defaultExcludedVariants: ['Other Songs:Features'],
  topSectionName: 'The XO 10',
  topSectionCount: 10,
};
