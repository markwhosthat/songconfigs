import { type ArtistConfig, STANDARD_VARIANT } from '../../core/types';
import songs from './songs.json';
import { ALBUM_THEMES } from './themes';

const SHOWGIRL = 'The Life Of A Showgirl';

// The re-recordings, each a variant of its album, ranked alongside the
// originals only when someone opts in.
const TAYLORS_VERSIONS = ['Fearless', 'Speak Now', 'Red', '1989'].map(album => `${album}:Taylor's Version`);

// Left out unless someone opts in (see defaultExcludedVariants below).
const DEFAULT_EXCLUDED = ['Other Songs:Features', 'The Life Of A Showgirl:Extras', 'Other Songs:Covers', 'Lover:Live From Paris', ...TAYLORS_VERSIONS];

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
// track, no originals.
const taylorsVersions = forAlbums(RERECORDED, ["Taylor's Version", 'From the Vault']);

// Her Christmas songs: the originals and the Holiday Collection's covers,
// but not her other covers.
// Track 5 of each album, the slot she keeps for her most emotional song:
// those albums' main tracks only, less every song but the fifth. The
// originals, as Default ranks them, not the Taylor's Versions.
const TRACK_FIVES: Record<string, string> = {
  'Taylor Swift': 'Cold As You',
  'Fearless': 'White Horse',
  'Speak Now': 'Dear John',
  'Red': 'All Too Well',
  '1989': 'All You Had To Do Was Stay',
  'Reputation': 'Delicate',
  'Lover': 'The Archer',
  'Folklore': 'my tears ricochet',
  'Evermore': 'tolerate it',
  'Midnights': "You're On Your Own, Kid",
  'The Tortured Poets Department': 'So Long, London',
  [SHOWGIRL]: 'Eldest Daughter',
};
const trackFives = {
  ...forAlbums(Object.keys(TRACK_FIVES), [STANDARD_VARIANT]),
  excludedSongs: songs
    .filter(s => s.album in TRACK_FIVES && !s.variants?.length && s.title !== TRACK_FIVES[s.album])
    .map(s => s.id),
};

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
  // One switch each across every album in the Filters panel; every song is
  // exactly one of these.
  songTypes: [
    { label: 'Album tracks', variants: [STANDARD_VARIANT] },
    { label: "Taylor's Versions", variants: ["Taylor's Version"] },
    // 3am Edition, The Anthology and The Encore are deluxe editions.
    { label: 'Deluxe', variants: ['Deluxe', '3am Edition', 'The Anthology', 'The Encore'] },
    // Bonus tracks, Showgirl's extra versions among them.
    { label: 'Bonus', variants: ['Bonus', 'Extras'] },
    { label: 'From the Vault', variants: ['From the Vault'] },
    { label: 'Remix', variants: ['Remix'] },
    // Lover (Live From Paris), the City of Lover concert recordings.
    { label: 'Live', variants: ['Live From Paris'] },
    { label: 'Soundtrack & singles', variants: ['Soundtrack', 'Singles'] },
    { label: 'Holiday', variants: ['Holiday'] },
    { label: 'Features', variants: ['Features'] },
    { label: 'Covers', variants: ['Covers'] },
  ],
  // Songs where she is a featured guest rather than the main artist, her
  // covers of other people's songs, the live versions, and the Taylor's
  // Version re-recordings.
  defaultExcludedVariants: DEFAULT_EXCLUDED,
  topSectionName: 'The Top 13',
  topSectionCount: 13,
  seo: {
    description: "Rank every Taylor Swift song, now including The Life of a Showgirl: The Encore. Choose between two songs at a time to build your ultimate personal ranking of Taylor's discography.",
    pages: {
      'The Encore': {
        title: 'Rank The Life of a Showgirl: The Encore | Taylor Swift Song Sorter',
        description: "Rank Patient Zero, Cleveland!, Pink Clouding and Babylon, the four new songs on Taylor Swift's The Life of a Showgirl: The Encore, two at a time.",
      },
      // Presets that are filtered copies of the full catalogue stay noindex,
      // but their titles still show in tabs and link previews.
      'Everything': {
        title: 'Rank Every Taylor Swift Song, Every Version | Taylor Swift Song Sorter',
        description: "Rank every Taylor Swift song: every album, Taylor's Version and vault track, plus features, covers and extras. Choose between two songs at a time.",
      },
      'Standard Tracks': {
        title: 'Rank Taylor Swift Album Tracks Only | Taylor Swift Song Sorter',
        description: "Rank the standard tracklists of Taylor Swift's albums, without deluxe, vault or bonus tracks. Choose between two songs at a time.",
      },
      "Default + Taylor's Versions": {
        title: "Rank Taylor Swift Songs with Taylor's Versions | Taylor Swift Song Sorter",
        description: "Rank Taylor Swift's songs with the Taylor's Version re-recordings alongside the originals. Choose between two songs at a time to build your ranking.",
      },
      'The Life Of A Showgirl: The Encore': {
        title: 'Rank The Life of a Showgirl + The Encore | Taylor Swift Song Sorter',
        description: "Rank The Life of a Showgirl's standard tracks and The Encore's four new songs together, two at a time.",
      },
      'Beyond the Albums': {
        title: "Rank Taylor Swift's Non-Album Songs | Taylor Swift Song Sorter",
        description: 'Rank the Taylor Swift songs that live outside her albums: singles, soundtrack songs, Christmas songs, features and covers, two at a time.',
      },
      'Holiday': {
        title: 'Rank Taylor Swift Christmas Songs | Taylor Swift Song Sorter',
        description: "Rank Taylor Swift's Christmas songs, from Christmas Tree Farm and Christmases When You Were Mine to Last Christmas and Santa Baby, two at a time.",
      },
      'Other Songs': {
        title: "Rank Taylor Swift's Non-Album Songs | Taylor Swift Song Sorter",
        description: "Rank Taylor Swift's songs outside her albums: soundtrack songs like Safe & Sound and Eyes Open, singles like Only The Young, and her Christmas songs, two at a time.",
      },
      "Taylor's Versions": {
        title: "Rank Every Taylor's Version Song | Taylor Swift Song Sorter",
        description: "Rank every song from Fearless, Speak Now, Red and 1989 (Taylor's Version), vault tracks included. Choose between two songs at a time to build your ranking.",
      },
      'From the Vault': {
        title: 'Rank Every From the Vault Song | Taylor Swift Song Sorter',
        description: "Rank all of Taylor Swift's From the Vault tracks, from You All Over Me to All Too Well (10 Minute Version) and You're Losing Me, two at a time.",
      },
      'Track 5': {
        title: 'Rank Every Taylor Swift Track 5 | Taylor Swift Song Sorter',
        description: 'Rank every Taylor Swift track 5, from Cold As You and All Too Well to my tears ricochet, So Long, London and Eldest Daughter, two at a time.',
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
  // Listed under their group in the Filters panel ("Start from"), after the
  // default; `label` is the button's name where the page's name is longer.
  filterPresets: [
    {
      name: "Default + Taylor's Versions",
      slug: 'default-plus-taylors-versions',
      excludedAlbums: [],
      excludedVariants: DEFAULT_EXCLUDED.filter(v => !TAYLORS_VERSIONS.includes(v)),
    },
    {
      name: 'Everything',
      slug: 'everything',
      excludedAlbums: [],
      excludedVariants: [],
    },
    {
      name: 'Standard Tracks',
      label: 'Album tracks only',
      slug: 'standard-tracks',
      // Exactly the Album tracks song type on its own.
      ...forAlbums(ALBUMS, [STANDARD_VARIANT]),
    },
    {
      name: 'The Encore',
      label: 'Encore new songs',
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
      label: 'Showgirl + Encore',
      group: 'New',
      slug: 'the-life-of-a-showgirl-the-encore',
      ...encoreEdition,
      themeKey: 'The Life Of A Showgirl: The Encore',
      title: { prefix: 'The', feature: 'Encore' },
    },
    {
      name: "Taylor's Versions",
      label: "Taylor's Versions only",
      group: 'Collections',
      slug: 'taylors-versions',
      ...taylorsVersions,
      indexable: true,
    },
    {
      name: 'From the Vault',
      label: 'Vault tracks only',
      group: 'Collections',
      slug: 'vault-tracks',
      ...forAlbums(VAULTED, ['From the Vault']),
      indexable: true,
    },
    {
      name: 'Track 5',
      label: 'Track 5s',
      group: 'Collections',
      slug: 'track-5s',
      ownPage: true,
      ...trackFives,
      // A set no album page covers - worth a search result.
      indexable: true,
    },
    {
      name: 'Beyond the Albums',
      group: 'Beyond',
      slug: 'beyond-the-albums',
      ...keep({ 'Other Songs': variantsOf('Other Songs') }),
    },
    {
      name: 'Collaborations',
      group: 'Beyond',
      slug: 'collaborations',
      ...keep({ 'Other Songs': ['Features'] }),
      indexable: true,
    },
    {
      name: 'Holiday',
      group: 'Beyond',
      slug: 'holiday',
      ...holiday,
      // Her Christmas songs, which no album page lists together.
      indexable: true,
    }
  ]
};
