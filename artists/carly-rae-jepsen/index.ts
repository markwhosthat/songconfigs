import { type ArtistConfig, STANDARD_VARIANT } from '../../core/types';
import songs from './songs.json';
import { ALBUM_THEMES } from './themes';

const DAY_AND_NIGHT = 'Day and Night';

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
// Albums whole, each with every one of its song types.
const wholeAlbums = (albums: string[]) =>
  keep(Object.fromEntries(albums.map(a => [a, variantsOf(a)])));

const idsOf = (titles: string[], album?: string) => titles.map(title => {
  const song = songs.find(s => s.title === title && (!album || s.album === album));
  if (!song) throw new Error(`Carly Rae Jepsen: no song "${title}"`);
  return song.id;
});

// Day and Night is a double album: songs.json lists disc one (Day), then disc
// two (Night), each with its bonus track last. A disc's preset is the album
// less the other disc's songs.
const DAY_AND_NIGHT_IDS = songs.filter(s => s.album === DAY_AND_NIGHT).map(s => s.id);
const [NIGHT_OPENER] = idsOf(['Never Let a Good Thing Die'], DAY_AND_NIGHT);
const NIGHT_START = DAY_AND_NIGHT_IDS.indexOf(NIGHT_OPENER!);
const DAY_DISC = DAY_AND_NIGHT_IDS.slice(0, NIGHT_START);
const NIGHT_DISC = DAY_AND_NIGHT_IDS.slice(NIGHT_START);

const CHRISTMAS = idsOf([
  'Mittens',
  'Let It Snow',
  'Last Christmas',
  "It's Not Christmas Till Somebody Cries",
], 'Other Songs');

const EXTRAS = ALBUMS.filter(a => a !== 'Other Songs' &&
  songs.some(s => s.album === a && s.variants?.some(v => v === 'Deluxe' || v === 'Bonus')));

export const CarlyRaeJepsenConfig: ArtistConfig = {
  id: 'carly-rae-jepsen',
  name: 'Carly Rae Jepsen',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: 'Emotion',
  storageKey: 'crj-song-sorter-session',
  // Song type switches in the Filters panel; every song is exactly one.
  songTypes: [
    { label: 'Album tracks', variants: [STANDARD_VARIANT] },
    { label: 'Deluxe', variants: ['Deluxe'] },
    // Regional, retailer and later-edition bonus tracks.
    { label: 'Bonus', variants: ['Bonus'] },
    // Emotion (10th Anniversary Edition), 2025.
    { label: 'Emotion 10th Anniversary', variants: ['10th Anniversary'] },
    { label: 'Singles', variants: ['Singles'] },
    { label: 'Features', variants: ['Features'] },
  ],
  // Songs where she is a featured guest rather than a main artist.
  defaultExcludedVariants: ['Other Songs:Features'],
  topSectionName: 'The Top 10',
  topSectionCount: 10,
  seo: {
    description: 'Rank every Carly Rae Jepsen song, from Tug of War, Kiss and Emotion to Dedicated, The Loneliest Time and Day and Night. Choose between two songs at a time to build your ultimate personal ranking.',
    pages: {
      'Emotion + Side B': {
        title: 'Rank Emotion + Emotion: Side B | Carly Rae Jepsen Song Sorter',
        description: 'Rank Emotion and Emotion: Side B together, deluxe and 10th anniversary tracks included, from Run Away with Me and Your Type to Cut to the Feeling and Store, two at a time.',
      },
      'Dedicated + Side B': {
        title: 'Rank Dedicated + Dedicated Side B | Carly Rae Jepsen Song Sorter',
        description: "Rank Dedicated and Dedicated Side B together, from Julien, Now That I Found You and Too Much to This Love Isn't Crazy and Comeback, two at a time.",
      },
      'The Loneliest Time + The Loveliest Time': {
        title: 'Rank The Loneliest Time + The Loveliest Time | Carly Rae Jepsen Song Sorter',
        description: 'Rank the companion albums together, from Western Wind, Beach House and The Loneliest Time to Shy Boy, Kamikaze and Psychedelic Switch, two at a time.',
      },
      'Day and Night: Day': {
        title: 'Rank Day and Night: Disc One (Day) | Carly Rae Jepsen Song Sorter',
        description: 'Rank the Day disc of Day and Night, from After All and On Wires to Lonely Side of the Bed and Just a Little Walk on the Moon, two at a time.',
      },
      'Day and Night: Night': {
        title: 'Rank Day and Night: Disc Two (Night) | Carly Rae Jepsen Song Sorter',
        description: "Rank the Night disc of Day and Night, from Never Let a Good Thing Die and Don't Leave Me on the Dance Floor to Motivation and Super Sage, two at a time.",
      },
      'Deluxe & Bonus Tracks': {
        title: 'Rank Carly Rae Jepsen Deluxe & Bonus Tracks | Carly Rae Jepsen Song Sorter',
        description: 'Rank Carly Rae Jepsen\'s deluxe and bonus tracks: Sweetie and Drive from Kiss, Black Heart and Favourite Colour from Emotion, Party for One, Keep Away and more, two at a time.',
      },
      'Christmas Songs': {
        title: 'Rank Carly Rae Jepsen Christmas Songs | Carly Rae Jepsen Song Sorter',
        description: "Rank Carly Rae Jepsen's Christmas songs: It's Not Christmas Till Somebody Cries, Last Christmas, Mittens and Let It Snow, two at a time.",
      },
      // Filtered copies of the full catalogue stay noindex, but their titles
      // still show in tabs and link previews.
      'Everything': {
        title: 'Rank Every Carly Rae Jepsen Song | Carly Rae Jepsen Song Sorter',
        description: 'Rank every Carly Rae Jepsen song: every album, deluxe and bonus track, single and feature. Choose between two songs at a time.',
      },
      'Standard Tracks': {
        title: 'Rank Carly Rae Jepsen Album Tracks Only | Carly Rae Jepsen Song Sorter',
        description: "Rank the standard tracklists of Carly Rae Jepsen's albums and EPs, without deluxe or bonus tracks. Choose between two songs at a time.",
      },
      'Beyond the Albums': {
        title: "Rank Carly Rae Jepsen's Non-Album Songs | Carly Rae Jepsen Song Sorter",
        description: 'Rank the Carly Rae Jepsen songs outside her albums, from Take a Picture, Last Christmas and OMG to Disco Darling, plus her features with Charli XCX, Bleachers and more, two at a time.',
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
      name: 'Emotion + Side B',
      group: 'Collections',
      slug: 'emotion-and-side-b',
      ...wholeAlbums(['Emotion', 'Emotion: Side B']),
      themeKey: 'Emotion',
      // A pairing no album page covers - worth a search result.
      indexable: true,
    },
    {
      name: 'Dedicated + Side B',
      group: 'Collections',
      slug: 'dedicated-and-side-b',
      ...wholeAlbums(['Dedicated', 'Dedicated Side B']),
      themeKey: 'Dedicated',
      indexable: true,
    },
    {
      name: 'The Loneliest Time + The Loveliest Time',
      label: 'Loneliest + Loveliest',
      group: 'Collections',
      slug: 'the-loneliest-and-loveliest-time',
      ...wholeAlbums(['The Loneliest Time', 'The Loveliest Time']),
      themeKey: 'The Loveliest Time',
      indexable: true,
    },
    {
      name: 'Day and Night: Day',
      label: 'Day and Night: Day disc',
      group: 'Collections',
      slug: 'day-disc',
      ...wholeAlbums([DAY_AND_NIGHT]),
      excludedSongs: NIGHT_DISC,
      themeKey: DAY_AND_NIGHT,
      indexable: true,
    },
    {
      name: 'Day and Night: Night',
      label: 'Day and Night: Night disc',
      group: 'Collections',
      slug: 'night-disc',
      ...wholeAlbums([DAY_AND_NIGHT]),
      excludedSongs: DAY_DISC,
      themeKey: DAY_AND_NIGHT,
      indexable: true,
    },
    {
      name: 'Deluxe & Bonus Tracks',
      label: 'Deluxe & bonus only',
      group: 'Collections',
      slug: 'deluxe-and-bonus-tracks',
      ...forAlbums(EXTRAS, ['Deluxe', 'Bonus', '10th Anniversary']),
      indexable: true,
    },
    {
      name: 'Christmas Songs',
      group: 'Beyond',
      slug: 'christmas-songs',
      ...keep({ 'Other Songs': ['Singles'] }),
      excludedSongs: songs.filter(s => s.album === 'Other Songs' && !CHRISTMAS.includes(s.id)).map(s => s.id),
      indexable: true,
    },
    {
      name: 'Beyond the Albums',
      group: 'Beyond',
      slug: 'beyond-the-albums',
      ...keep({ 'Other Songs': variantsOf('Other Songs') }),
    },
  ],
};
