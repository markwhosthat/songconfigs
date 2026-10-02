import { type ArtistConfig, STANDARD_VARIANT } from '../../core/types';
import songs from './songs.json';
import { ALBUM_THEMES } from './themes';

const SHOWGIRL = 'The Life Of A Showgirl';

// The re-recordings, each a variant of its album, ranked alongside the
// originals only when someone opts in.
const TAYLORS_VERSIONS = ['Fearless', 'Speak Now', 'Red', '1989'].map(album => `${album}:Taylor's Version`);

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

// Builds a preset's filters from what it keeps: these albums, and in each
// only the listed variants (Standard for its untagged main tracks).
const ALBUMS = [...new Set(songs.map(s => s.album))];
const variantsOf = (album: string) =>
  [STANDARD_VARIANT, ...new Set(songs.filter(s => s.album === album).flatMap(s => s.variants ?? []))];
const keep = (spec: Record<string, string[]>) => ({
  excludedAlbums: ALBUMS.filter(a => !(a in spec)),
  excludedVariants: Object.entries(spec).flatMap(([album, kept]) =>
    variantsOf(album).filter(v => !kept.includes(v)).map(v => `${album}:${v}`)),
});
const forAlbums = (albums: string[], kept: string[]) =>
  keep(Object.fromEntries(albums.map(a => [a, kept])));

const RERECORDED = ['Fearless', 'Speak Now', 'Red', '1989'];
const VAULTED = ALBUMS.filter(a => songs.some(s => s.album === a && s.variants?.includes('From the Vault')));

// The four re-recorded albums as released: every Taylor's Version and vault
// track, no originals. A deluxe track's re-recording also carries Deluxe,
// so those variants stay in and the original deluxe tracks go song by song.
const taylorsVersions = {
  ...forAlbums(RERECORDED, ["Taylor's Version", 'From the Vault', 'Deluxe', 'Soundtrack', 'Bonus']),
  excludedSongs: songs
    .filter(s => RERECORDED.includes(s.album) && s.variants?.length
      && !s.variants.includes("Taylor's Version") && !s.variants.includes('From the Vault'))
    .map(s => s.id),
};

// Her Christmas songs: the originals and the Holiday Collection's covers,
// but not her other covers.
const holiday = {
  ...keep({ 'Other Songs': ['Holiday', 'Covers'] }),
  excludedSongs: songs.filter(s => s.album === 'Other Songs' && s.title === 'September').map(s => s.id),
};

export const TaylorSwiftConfig: ArtistConfig = {
  id: 'taylor-swift',
  name: 'Taylor Swift',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: 'The Life Of A Showgirl: The Encore',
  storageKey: 'ts-song-sorter-session',
  // Songs where she is a featured guest rather than the main artist, her
  // covers of other people's songs, and the Taylor's Version re-recordings.
  defaultExcludedVariants: ['Other Songs:Features', 'Other Songs:Covers', ...TAYLORS_VERSIONS],
  topSectionName: 'The Top 13',
  topSectionCount: 13,
  seo: {
    description: "Rank every Taylor Swift song, now including The Life of a Showgirl: The Encore. Choose between two songs at a time to build your ultimate personal ranking of Taylor's discography.",
    pages: {
      'The Encore': {
        title: 'Rank The Life of a Showgirl: The Encore | Taylor Swift Song Sorter',
        description: "Rank Patient Zero, Cleveland!, Pink Clouding and Babylon, the four new songs on Taylor Swift's The Life of a Showgirl: The Encore, two at a time.",
      },
      "Taylor's Versions": {
        title: "Rank Every Taylor's Version Song | Taylor Swift Song Sorter",
        description: "Rank every song from Fearless, Speak Now, Red and 1989 (Taylor's Version), vault tracks included. Choose between two songs at a time to build your ranking.",
      },
      'From the Vault': {
        title: 'Rank Every From the Vault Song | Taylor Swift Song Sorter',
        description: "Rank all of Taylor Swift's From the Vault tracks, from You All Over Me to All Too Well (10 Minute Version) and You're Losing Me, two at a time.",
      },
      'Collaborations': {
        title: 'Rank Taylor Swift Collaborations & Features | Taylor Swift Song Sorter',
        description: 'Rank the songs Taylor Swift features on, from Highway Don\'t Care and Both Of Us to The Joker And The Queen, The Alcott and us., two at a time.',
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
      group: 'New',
      slug: 'the-encore',
      ...encoreOnly,
      themeKey: 'The Life Of A Showgirl: The Encore',
      title: { prefix: 'The', feature: 'Encore' },
      // Four songs no album page lists on their own - worth a search result.
      indexable: true,
    },
    {
      name: 'The Life Of A Showgirl: The Encore',
      group: 'New',
      slug: 'the-life-of-a-showgirl-the-encore',
      ...encoreEdition,
      themeKey: 'The Life Of A Showgirl: The Encore',
      title: { prefix: 'The', feature: 'Encore' },
    },
    {
      name: 'Everything',
      group: 'Size',
      slug: 'everything',
      excludedAlbums: [],
      excludedVariants: [],
    },
    {
      name: 'No Extra Tracks',
      group: 'Size',
      slug: 'no-extra-tracks',
      excludedAlbums: [],
      excludedVariants: [
        'Midnights:Remix',
        'The Life Of A Showgirl:Extras',
        'Other Songs:Features',
        'Other Songs:Covers',
        ...TAYLORS_VERSIONS
      ]
    },
    {
      name: 'Standard Tracks',
      group: 'Size',
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
        'The Life Of A Showgirl:Extras', 'The Life Of A Showgirl:The Encore',
        ...TAYLORS_VERSIONS
      ]
    },
    {
      name: "Taylor's Versions",
      group: 'Recordings',
      slug: 'taylors-versions',
      ...taylorsVersions,
      indexable: true,
    },
    {
      name: 'From the Vault',
      group: 'Recordings',
      slug: 'vault-tracks',
      ...forAlbums(VAULTED, ['From the Vault']),
      indexable: true,
    },
    {
      name: 'Beyond the Albums',
      group: 'Extras',
      slug: 'beyond-the-albums',
      ...keep({ 'Other Songs': variantsOf('Other Songs') }),
    },
    {
      name: 'Collaborations',
      group: 'Extras',
      slug: 'collaborations',
      ...keep({ 'Other Songs': ['Features'] }),
      indexable: true,
    },
    {
      name: 'Holiday',
      group: 'Extras',
      slug: 'holiday',
      ...holiday,
    }
  ]
};
