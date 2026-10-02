import { type ArtistConfig, STANDARD_VARIANT } from '../../core/types';
import songs from './songs.json';
import { ALBUM_THEMES } from './themes';

const SHOWGIRL = 'The Life Of A Showgirl';

// The re-recordings, each a variant of its album, ranked alongside the
// originals only when someone opts in.
const TAYLORS_VERSIONS = ['Fearless', 'Speak Now', 'Red', '1989'].map(album => `${album}:Taylor's Version`);

// Left out unless someone opts in (see defaultExcludedVariants below).
const DEFAULT_EXCLUDED = ['Other Songs:Features', 'The Life Of A Showgirl:Extras', 'Other Songs:Covers', ...TAYLORS_VERSIONS];

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
    { label: 'Deluxe & bonus', variants: ['Deluxe', 'Bonus'] },
    { label: 'From the Vault', variants: ['From the Vault'] },
    { label: '3am Edition', variants: ['3am Edition'] },
    { label: 'The Anthology', variants: ['The Anthology'] },
    { label: 'The Encore', variants: ['The Encore'] },
    { label: 'Extras', variants: ['Extras'] },
    { label: 'Remix', variants: ['Remix'] },
    { label: 'Soundtrack & singles', variants: ['Soundtrack', 'Singles'] },
    { label: 'Holiday', variants: ['Holiday'] },
    { label: 'Features', variants: ['Features'] },
    { label: 'Covers', variants: ['Covers'] },
  ],
  // Songs where she is a featured guest rather than the main artist, her
  // covers of other people's songs, and the Taylor's Version re-recordings.
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
    }
  ]
};
