import { type ArtistConfig, STANDARD_VARIANT } from '../../core/types';
import songs from './songs.json';
import { ALBUM_THEMES } from './themes';

export const OneDirectionConfig: ArtistConfig = {
  id: 'one-direction',
  name: 'One Direction',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: 'Midnight Memories',
  storageKey: 'one-direction-song-sorter-session',
  // Song type switches in the Filters panel; every song is exactly one.
  songTypes: [
    { label: 'Album tracks', variants: [STANDARD_VARIANT] },
    // The deluxe editions' extra songs: Up All Night's Souvenir Edition,
    // Take Me Home's Expanded Edition, Midnight Memories' Deluxe Edition,
    // Four's Ultimate Edition and Made in the A.M.'s Deluxe Edition.
    { label: 'Deluxe', variants: ['Deluxe'] },
    // One Way or Another (Teenage Kicks) and Home.
    { label: 'Singles', variants: ['Singles'] },
  ],
  topSectionName: 'The Top 10',
  topSectionCount: 10,
  seo: {
    description: 'Rank every One Direction song, from Up All Night and Take Me Home to Midnight Memories, Four and Made in the A.M. Choose between two songs at a time to build your ultimate personal ranking.',
  },
};
