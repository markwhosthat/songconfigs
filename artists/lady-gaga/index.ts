import type { ArtistConfig } from '../../core/types';
import songs from './songs.json';
import { ALBUM_THEMES } from './themes';

export const LadyGagaConfig: ArtistConfig = {
  id: 'lady-gaga',
  name: 'Lady Gaga',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: 'The Fame',
  storageKey: 'gaga-song-sorter-session',
  topSectionName: 'The Top 10',
  topSectionCount: 10,
};
