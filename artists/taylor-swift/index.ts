import type { ArtistConfig } from '../../core/types';
import songs from './songs.json';
import { ALBUM_THEMES } from './themes';

const SHOWGIRL = 'The Life Of A Showgirl';

// Just the Encore's new songs: every other album out, and within Showgirl
// the Extras variant and the standard tracks (which carry no variant, so
// only a song-level exclusion can drop them).
const encoreOnly = {
  excludedAlbums: [...new Set(songs.map(s => s.album))].filter(a => a !== SHOWGIRL),
  excludedVariants: [`${SHOWGIRL}:Extras`],
  excludedSongs: songs.filter(s => s.album === SHOWGIRL && !s.variants?.length).map(s => s.id),
};

// The Encore edition as released: the standard tracks and the four new
// songs, without the Extras' acoustic and alternate versions.
const encoreEdition = {
  excludedAlbums: encoreOnly.excludedAlbums,
  excludedVariants: [`${SHOWGIRL}:Extras`],
};

export const TaylorSwiftConfig: ArtistConfig = {
  id: 'taylor-swift',
  name: 'Taylor Swift',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: 'The Life Of A Showgirl: The Encore',
  storageKey: 'ts-song-sorter-session',
  topSectionName: 'The Top 13',
  topSectionCount: 13,
  seo: {
    description: "Rank every Taylor Swift song, now including The Life of a Showgirl: The Encore. Choose between two songs at a time to build your ultimate personal ranking of Taylor's discography.",
    pages: {
      'The Encore': {
        title: 'Rank The Life of a Showgirl: The Encore | Taylor Swift Song Sorter',
        description: "Rank Patient Zero, Cleveland!, Pink Clouding and Babylon, the four new songs on Taylor Swift's The Life of a Showgirl: The Encore, two at a time.",
      },
      [SHOWGIRL]: {
        title: 'The Life of a Showgirl + The Encore (Taylor Swift) Song Sorter',
        description: "Rank every song on Taylor Swift's The Life of a Showgirl, now with The Encore's Patient Zero, Cleveland!, Pink Clouding and Babylon. Choose between two songs at a time.",
      },
    },
  },
  promo: {
    text: 'TLOAS: The Encore is out now',
    links: [
      { label: 'Rank whole album', slug: 'the-life-of-a-showgirl-the-encore' },
      { label: 'Rank new songs', slug: 'the-encore' },
    ],
  },
  filterPresets: [
    {
      name: 'The Encore',
      slug: 'the-encore',
      ...encoreOnly,
      themeKey: 'The Life Of A Showgirl: The Encore',
      title: { prefix: 'The', feature: 'Encore' },
      // Four songs no album page lists on their own - worth a search result.
      indexable: true,
    },
    {
      name: 'The Life Of A Showgirl: The Encore',
      slug: 'the-life-of-a-showgirl-the-encore',
      ...encoreEdition,
      themeKey: 'The Life Of A Showgirl: The Encore',
      title: { prefix: 'The', feature: 'Encore' },
    },
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
        'The Life Of A Showgirl:Extras', 'The Life Of A Showgirl:The Encore'
      ]
    }
  ]
};
