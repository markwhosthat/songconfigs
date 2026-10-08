import { type ArtistConfig, STANDARD_VARIANT } from '../../core/types';
import songs from './songs.json';
import { ALBUM_THEMES } from './themes';

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
const albumsWith = (variant: string) =>
  ALBUMS.filter(a => songs.some(s => s.album === a && s.variants?.includes(variant)));

// Song types left out until someone opts in.
const OPT_IN = ['Bonus', 'Promo', 'Remix', 'Holiday', 'Features', 'Versions'];

export const JustinBieberConfig: ArtistConfig = {
  id: 'justin-bieber',
  name: 'Justin Bieber',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: 'SWAG',
  storageKey: 'jb-song-sorter-session',
  // Song type switches in the Filters panel; every song is exactly one.
  songTypes: [
    { label: 'Album tracks', variants: [STANDARD_VARIANT] },
    // The deluxe and bonus editions' new songs, Justice's Triple Chucks and
    // Complete Edition songs included.
    { label: 'Deluxe', variants: ['Deluxe'] },
    // New songs released beside an album: Believe Acoustic's Yellow
    // Raincoat, I Would and Nothing Like Us, and Flatline with Journals.
    { label: 'Bonus', variants: ['Bonus'] },
    // Non-album singles: Never Say Never, Born to Be Somebody, Pray,
    // Friends and Honest.
    { label: 'Singles', variants: ['Singles'] },
    // Turn to You, Beautiful Love (Free Fire) and I Feel Funny.
    { label: 'Promo singles', variants: ['Promo'] },
    { label: 'Remix', variants: ['Remix'] },
    // Rockin' Around the Christmas Tree and Lonely Christmas; Under the
    // Mistletoe is an album of its own.
    { label: 'Holiday', variants: ['Holiday'] },
    // Singles led by or shared with other artists: Despacito (Remix), Let
    // Me Love You, Cold Water, I Don't Care, Stuck with U, STAY and more.
    { label: 'Collaborations', variants: ['Collaborations'] },
    // Guest spots on other artists' album tracks and the charity singles.
    { label: 'Features', variants: ['Features'] },
    // My Worlds Acoustic, Believe Acoustic, the acoustic singles and the two
    // SWAG Live from Coachella albums.
    { label: 'Live & acoustic', variants: ['Versions'] },
  ],
  // Left out until someone opts in: everything beyond the albums, their
  // deluxe songs, his own singles and his collaboration singles.
  defaultExcludedVariants: OPT_IN.flatMap(v => albumsWith(v).map(a => `${a}:${v}`)),
  topSectionName: 'The Top 10',
  topSectionCount: 10,
  seo: {
    description: 'Rank every Justin Bieber song, from My World and Believe to Purpose, Changes, Justice, SWAG and SWAG II. Choose between two songs at a time to build your ultimate personal ranking.',
    pages: {
      'Collaborations': {
        title: 'Rank Justin Bieber Collaborations & Features | Justin Bieber Song Sorter',
        description: 'Rank the songs Justin Bieber shares with other artists, from Despacito (Remix), Let Me Love You and Cold Water to I Don\'t Care, Stuck with U, Monster, STAY and his guest verses, two at a time.',
      },
      'Remixes': {
        title: 'Rank Justin Bieber Remixes | Justin Bieber Song Sorter',
        description: 'Rank Justin Bieber\'s remixes, from Never Say Never: The Remixes to Sorry (Latino Remix), What Do You Mean? (Remix) and Peaches (Remix), two at a time.',
      },
      'Live & Acoustic': {
        title: 'Rank Justin Bieber Live & Acoustic Versions | Justin Bieber Song Sorter',
        description: 'Rank Justin Bieber\'s live and acoustic versions, from My Worlds Acoustic and Believe Acoustic to SWAG Live from Coachella, two at a time.',
      },
      'Christmas Songs': {
        title: "Rank Justin Bieber's Christmas Songs | Justin Bieber Song Sorter",
        description: 'Rank Justin Bieber\'s Christmas songs: Under the Mistletoe, its deluxe songs, Rockin\' Around the Christmas Tree and Lonely Christmas, two at a time.',
      },
      // Filtered copies of the full catalogue stay noindex, but their titles
      // still show in tabs and link previews.
      'Everything': {
        title: 'Rank Every Justin Bieber Song | Justin Bieber Song Sorter',
        description: 'Rank every Justin Bieber song: every album, deluxe and bonus song, single, collaboration, remix, Christmas song, feature, and live and acoustic version. Choose between two songs at a time.',
      },
      'Standard Tracks': {
        title: 'Rank Justin Bieber Album Tracks Only | Justin Bieber Song Sorter',
        description: "Rank the standard tracklists of Justin Bieber's albums, without deluxe, bonus or remix tracks. Choose between two songs at a time.",
      },
      'Beyond the Albums': {
        title: "Rank Justin Bieber's Non-Album Songs | Justin Bieber Song Sorter",
        description: "Rank the Justin Bieber songs outside his albums, from Never Say Never, Friends and Honest to his features and Christmas songs, two at a time.",
      },
    },
  },
  // Listed under their group in the Filters panel ("Start from"), after the
  // default; `label` is the button's name where the page's name is longer.
  filterPresets: [
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
      name: 'Beyond the Albums',
      group: 'Beyond',
      slug: 'beyond-the-albums',
      ...keep({ 'Other Songs': variantsOf('Other Songs') }),
    },
    {
      name: 'Collaborations',
      group: 'Beyond',
      slug: 'collaborations',
      ...keep({ 'Other Songs': ['Collaborations', 'Features'] }),
      indexable: true,
    },
    {
      name: 'Christmas Songs',
      label: 'Christmas',
      group: 'Beyond',
      slug: 'christmas',
      ...keep({ 'Under the Mistletoe': [STANDARD_VARIANT, 'Deluxe'], 'Other Songs': ['Holiday'] }),
      themeKey: 'Under the Mistletoe',
      indexable: true,
    },
    {
      name: 'Remixes',
      group: 'Collections',
      slug: 'remixes',
      ...forAlbums(albumsWith('Remix'), ['Remix']),
      indexable: true,
    },
    {
      name: 'Live & Acoustic',
      group: 'Collections',
      slug: 'live-and-acoustic',
      ...forAlbums(albumsWith('Versions'), ['Versions']),
      indexable: true,
    },
  ],
};
