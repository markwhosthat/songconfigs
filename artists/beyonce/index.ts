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
// Albums whole, each with every one of its song types.
const wholeAlbums = (albums: string[]) =>
  keep(Object.fromEntries(albums.map(a => [a, variantsOf(a)])));
// Every album's `Album:Variant` for these variants, wherever they occur.
const everywhere = (variants: string[]) =>
  ALBUMS.flatMap(a => variantsOf(a).filter(v => variants.includes(v)).map(v => `${a}:${v}`));

const idsOf = (titles: string[], album?: string) => titles.map(title => {
  const song = songs.find(s => s.title === title && (!album || s.album === album));
  if (!song) throw new Error(`Beyoncé: no song "${title}"`);
  return song.id;
});

// Her solo studio albums, without Everything Is Love (as The Carters) or
// The Lion King: The Gift (a curated soundtrack).
const SOLO_ALBUMS = ['Dangerously in Love', "B'Day", 'I Am... Sasha Fierce', '4', 'BEYONCÉ', 'Lemonade', 'RENAISSANCE', 'COWBOY CARTER'];

// The songs B'Day (20th Anniversary Deluxe Edition), 2026, added.
const BDAY_20TH = idsOf([
  'Morning Dew (Donk)',
  'My First Time',
  'Can I Watch You (feat. Pharrell Williams)',
  'Lost Yo Mind',
  'Creole',
  'Back Up',
  'Cuerpo (Tumbao) (feat. Maluma)',
  'Irreemplazable (Como la Flor) (feat. Selena)',
], "B'Day");

const EXTRAS = ALBUMS.filter(a => a !== 'Other Songs' &&
  songs.some(s => s.album === a && s.variants?.some(v => v === 'Deluxe' || v === 'Bonus')));

export const BeyonceConfig: ArtistConfig = {
  id: 'beyonce',
  name: 'Beyoncé',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: 'COWBOY CARTER',
  storageKey: 'beyonce-song-sorter-session',
  // Song type switches in the Filters panel; every song is exactly one.
  songTypes: [
    { label: 'Album tracks', variants: [STANDARD_VARIANT] },
    // Deluxe, platinum and expanded editions, B'Day's 20th anniversary
    // deluxe among them.
    { label: 'Deluxe', variants: ['Deluxe'] },
    // Tracks only on some regional or store editions, or released later.
    { label: 'Bonus', variants: ['Bonus'] },
    { label: 'Remix', variants: ['Remix'] },
    { label: 'Spanish versions', variants: ['Spanish'] },
    { label: 'Soundtrack & singles', variants: ['Soundtrack', 'Singles'] },
    { label: 'Features', variants: ['Features'] },
  ],
  // Songs where she is a featured guest, and the remixes and Spanish
  // versions - her catalogue has so many that a whole-discography sort would
  // meet Get Me Bodied four times over.
  defaultExcludedVariants: ['Other Songs:Features', ...everywhere(['Remix', 'Spanish'])],
  topSectionName: 'The Top 10',
  topSectionCount: 10,
  seo: {
    description: "Rank every Beyoncé song, from Dangerously in Love, B'Day and I Am... Sasha Fierce to Lemonade, RENAISSANCE and COWBOY CARTER. Choose between two songs at a time to build your ultimate personal ranking.",
    pages: {
      "B'Day 20th Anniversary": {
        title: "Rank B'Day's 20th Anniversary Songs | Beyoncé Song Sorter",
        description: "Rank the songs B'Day (20th Anniversary Deluxe Edition) added, from Morning Dew (Donk), Can I Watch You and Creole to Cuerpo (Tumbao) with Maluma and Irreemplazable with Selena, two at a time.",
      },
      'RENAISSANCE + COWBOY CARTER': {
        title: 'Rank RENAISSANCE + COWBOY CARTER | Beyoncé Song Sorter',
        description: "Rank Act I and Act II together, from BREAK MY SOUL, CUFF IT and ALIEN SUPERSTAR to TEXAS HOLD 'EM, 16 CARRIAGES and II MOST WANTED, two at a time.",
      },
      'The Solo Studio Albums': {
        title: 'Rank Every Beyoncé Solo Album Song | Beyoncé Song Sorter',
        description: "Rank the songs from Beyoncé's eight solo studio albums, Dangerously in Love to COWBOY CARTER, without Everything Is Love or The Lion King: The Gift, two at a time.",
      },
      'Deluxe & Bonus Tracks': {
        title: 'Rank Beyoncé Deluxe & Bonus Tracks | Beyoncé Song Sorter',
        description: "Rank Beyoncé's deluxe and bonus tracks, from Ego, Smash Into You and Schoolin' Life to 7/11, BLACK PARADE and B'Day's 20th anniversary songs, two at a time.",
      },
      // Filtered copies of the full catalogue stay noindex, but their titles
      // still show in tabs and link previews.
      'Everything': {
        title: 'Rank Every Beyoncé Song | Beyoncé Song Sorter',
        description: 'Rank every Beyoncé song: every album, deluxe and bonus track, remix, Spanish version, single and feature. Choose between two songs at a time.',
      },
      'Standard Tracks': {
        title: 'Rank Beyoncé Album Tracks Only | Beyoncé Song Sorter',
        description: "Rank the standard tracklists of Beyoncé's albums, without deluxe or bonus tracks. Choose between two songs at a time.",
      },
      'Beyond the Albums': {
        title: "Rank Beyoncé's Non-Album Songs | Beyoncé Song Sorter",
        description: 'Rank the Beyoncé songs outside her albums, from Work It Out, At Last and Die with You to MY HOUSE, plus her features with JAY-Z, Lady Gaga, Nicki Minaj and more, two at a time.',
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
      name: "B'Day 20th Anniversary",
      label: "B'Day 20th new songs",
      group: 'New',
      slug: 'bday-20th-anniversary',
      ...wholeAlbums(["B'Day"]),
      excludedSongs: songs.filter(s => s.album === "B'Day" && !BDAY_20TH.includes(s.id)).map(s => s.id),
      themeKey: "B'Day",
      // Songs no album page lists on their own - worth a search result.
      indexable: true,
    },
    {
      name: 'RENAISSANCE + COWBOY CARTER',
      label: 'Act I + Act II',
      group: 'Collections',
      slug: 'renaissance-and-cowboy-carter',
      ...forAlbums(['RENAISSANCE', 'COWBOY CARTER'], [STANDARD_VARIANT]),
      themeKey: 'RENAISSANCE',
      indexable: true,
    },
    {
      name: 'The Solo Studio Albums',
      label: 'Solo studio albums',
      group: 'Collections',
      slug: 'solo-studio-albums',
      ...forAlbums(SOLO_ALBUMS, [STANDARD_VARIANT, 'Deluxe', 'Bonus']),
      indexable: true,
    },
    {
      name: 'Deluxe & Bonus Tracks',
      label: 'Deluxe & bonus only',
      group: 'Collections',
      slug: 'deluxe-and-bonus-tracks',
      ...forAlbums(EXTRAS, ['Deluxe', 'Bonus']),
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
