import type { ArtistConfig } from '../../core/types';
import songs from './songs.json';
import { ALBUM_THEMES } from './themes';

export const HarryStylesConfig: ArtistConfig = {
  id: 'harry-styles',
  name: 'Harry Styles',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: 'Kiss All The Time. Disco, Occasionally.',
  storageKey: 'harry-styles-song-sorter-session',
  topSectionName: 'The Top 10',
  topSectionCount: 10,
  seo: {
    description: "Rank every Harry Styles song, from Harry Styles and Fine Line to Harry's House and Kiss All The Time. Disco, Occasionally. Choose between two songs at a time to build your ultimate personal ranking.",
  },
};
