import type { ArtistConfig } from '../../core/types';
import songs from './songs.json';
import { ALBUM_THEMES } from './themes';

export const ArianaGrandeConfig: ArtistConfig = {
  id: 'ariana-grande',
  name: 'Ariana Grande',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: 'petal',
  storageKey: 'ag-song-sorter-session',
};
