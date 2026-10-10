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

const REMIX_ALBUM = 'Midnight Sun: Girls Trip';

// The Girls Trip remixes, each Midnight Sun song again with a guest, ranked
// alongside the originals only when someone opts in.
const GIRLS_TRIP = `${REMIX_ALBUM}:Remix`;

// Left out unless someone opts in (see defaultExcludedVariants below).
const DEFAULT_EXCLUDED = [GIRLS_TRIP, 'Other Songs:Covers'];

// Her studio albums; the Introducing, Allow Me to Reintroduce Myself and
// Honor The Light EPs stand apart. Songs 1 and the Uncover EP gathered from
// the first two EPs stay on the EP they first came out on.
const STUDIO_ALBUMS = ['1', 'So Good', 'Poster Girl', 'VENUS', 'Midnight Sun'];
const EPS = ['Introducing', 'Allow Me to Reintroduce Myself', 'Honor The Light'];

// Midnight Sun: Girls Trip as released: the remixes and, on its second
// disc, the original album.
const girlsTripEdition = forAlbums(['Midnight Sun', REMIX_ALBUM], [STANDARD_VARIANT, 'Remix']);

// The songs released as singles from her own records (Wikipedia's singles
// as lead artist, Symphony included as it closes So Good), less the songs
// where she is a guest.
const SINGLES = new Set([
  'Uncover', "She's Not Me (Pt. 1)", "She's Not Me (Pt. 2)", 'Bad Boys',
  'Carry You Home', 'Rooftop', 'Weak Heart',
  'Lush Life', 'Never Forget You (with MNEK)', "Ain't My Fault", 'I Would Like',
  'So Good (feat. Ty Dolla $ign)', 'Symphony (with Clean Bandit)', "Don't Let Me Be Yours", 'Only You',
  'Ruin My Life', "Don't Worry Bout Me", 'All the Time', 'A Brand New Day (with BTS)', 'Invisible',
  'Love Me Land', 'WOW', 'Talk About Love (feat. Young Thug)', "Look What You've Done",
  "Can't Tame Her", 'End Of Time', 'On My Love (with David Guetta)', 'Memory Lane', 'Winter Song',
  'Silent Night', 'You Love Who You Love',
  'Pretty Ugly', 'Midnight Sun', 'Crush', 'Blue Moon',
]);
const SINGLE_ALBUMS = [...new Set(songs.filter(s => SINGLES.has(s.title) && !s.variants?.includes('Remix')).map(s => s.album))];
const singles = {
  ...keep(Object.fromEntries(SINGLE_ALBUMS.map(a => [a, variantsOf(a)]))),
  excludedSongs: songs
    .filter(s => SINGLE_ALBUMS.includes(s.album) && (!SINGLES.has(s.title) || s.variants?.includes('Remix')))
    .map(s => s.id),
};

// Her Christmas songs: Honor The Light and Mary, Did You Know? from The Star.
const holiday = {
  ...keep({ 'Honor The Light': [STANDARD_VARIANT], 'Other Songs': ['Soundtracks'] }),
  excludedSongs: songs.filter(s => s.album === 'Other Songs' && s.title !== 'Mary, Did You Know?').map(s => s.id),
};

export const ZaraLarssonConfig: ArtistConfig = {
  id: 'zara-larsson',
  name: 'Zara Larsson',
  songs,
  themes: ALBUM_THEMES,
  defaultThemeKey: 'Midnight Sun',
  storageKey: 'zara-larsson-song-sorter-session',
  // Song type switches in the Filters panel; every song is exactly one.
  songTypes: [
    { label: 'Album tracks', variants: [STANDARD_VARIANT] },
    // Morning and Last Summer.
    { label: 'Poster Girl (Summer Edition)', variants: ['Summer Edition'] },
    // Don't Worry Bout Me and All the Time, on Poster Girl only in Japan;
    // Nobody Is an Island; Mary, Did You Know? (The Star), A Brand New Day
    // (BTS World) and Invisible (Klaus).
    { label: 'Soundtracks & singles', variants: ['Soundtracks', 'Singles'] },
    // Midnight Sun: Girls Trip.
    { label: 'Girls Trip remixes', variants: ['Remix'] },
    { label: 'Features', variants: ['Features'] },
    // My Heart Will Go On (her Talang single), Sexual (Spotify Singles), Times
    // Like These, Lay All Your Love on Me and How Deep Is Your Love (Spotify
    // Live Room).
    { label: 'Covers', variants: ['Covers'] },
  ],
  // The Girls Trip remixes and her covers of other people's songs; her
  // features are in.
  defaultExcludedVariants: DEFAULT_EXCLUDED,
  topSectionName: 'The Top 10',
  topSectionCount: 10,
  seo: {
    description: 'Rank every Zara Larsson song, from 1 and So Good to Poster Girl, VENUS and Midnight Sun. Choose between two songs at a time to build your ultimate personal ranking.',
    pages: {
      'The Studio Albums': {
        title: 'Rank Every Zara Larsson Album Song | Zara Larsson Song Sorter',
        description: 'Rank the songs from 1, So Good, Poster Girl, VENUS and Midnight Sun together, Summer Edition tracks included, two at a time.',
      },
      'The EPs': {
        title: "Rank Zara Larsson's EPs | Zara Larsson Song Sorter",
        description: "Rank the songs from Zara Larsson's EPs Introducing, Allow Me to Reintroduce Myself and Honor The Light, from Uncover and She's Not Me to Memory Lane, two at a time.",
      },
      'The Singles': {
        title: 'Rank Every Zara Larsson Single | Zara Larsson Song Sorter',
        description: 'Rank every Zara Larsson single, from Uncover and Lush Life to Never Forget You, Ruin My Life, WOW, Can\'t Tame Her and Midnight Sun, two at a time.',
      },
      'Midnight Sun + Girls Trip': {
        title: 'Rank Midnight Sun: Girls Trip | Zara Larsson Song Sorter',
        description: 'Rank Midnight Sun and its Girls Trip remixes with PinkPantheress, Kehlani, Shakira, Tyla, Robyn and more together, two at a time.',
      },
      'Collaborations': {
        title: 'Rank Zara Larsson Collaborations & Features | Zara Larsson Song Sorter',
        description: "Rank the songs Zara Larsson features on, from Girls Like and This One's for You to Words, Stateside, SHE DID IT AGAIN and Talk To Me, Zara, two at a time.",
      },
      'Holiday': {
        title: 'Rank Zara Larsson Christmas Songs | Zara Larsson Song Sorter',
        description: "Rank Zara Larsson's Christmas songs, from Memory Lane and Winter Song to Silent Night and Mary, Did You Know?, two at a time.",
      },
      // Filtered copies of the full catalogue stay noindex, but their titles
      // still show in tabs and link previews.
      'Default + Girls Trip': {
        title: 'Rank Zara Larsson Songs with the Girls Trip Remixes | Zara Larsson Song Sorter',
        description: 'Rank Zara Larsson\'s songs with the Midnight Sun: Girls Trip remixes alongside the originals. Choose between two songs at a time.',
      },
      'Everything': {
        title: 'Rank Every Zara Larsson Song | Zara Larsson Song Sorter',
        description: 'Rank every Zara Larsson song: every album and EP track, single, soundtrack song, Girls Trip remix, feature and cover. Choose between two songs at a time.',
      },
      'Standard Tracks': {
        title: 'Rank Zara Larsson Album Tracks Only | Zara Larsson Song Sorter',
        description: "Rank the standard tracklists of Zara Larsson's albums and EPs, without bonus tracks. Choose between two songs at a time.",
      },
      'Beyond the Albums': {
        title: "Rank Zara Larsson's Non-Album Songs | Zara Larsson Song Sorter",
        description: "Rank the Zara Larsson songs outside her records, from Don't Worry Bout Me and Nobody Is an Island to Invisible, plus her features and covers, two at a time.",
      },
    },
  },
  // Listed under their group in the Filters panel ("Start from"), after the
  // default; `label` is the button's name where the page's name is longer.
  filterPresets: [
    {
      name: 'Default + Girls Trip',
      label: 'Default + Girls Trip remixes',
      slug: 'default-plus-girls-trip',
      excludedAlbums: [],
      excludedVariants: DEFAULT_EXCLUDED.filter(v => v !== GIRLS_TRIP),
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
      name: 'The Studio Albums',
      label: 'Studio albums',
      group: 'Collections',
      slug: 'studio-albums',
      ...forAlbums(STUDIO_ALBUMS, [STANDARD_VARIANT, 'Summer Edition']),
      indexable: true,
    },
    {
      name: 'The EPs',
      label: 'EPs',
      group: 'Collections',
      slug: 'eps',
      ...forAlbums(EPS, [STANDARD_VARIANT]),
      indexable: true,
    },
    {
      name: 'The Singles',
      label: 'Singles',
      group: 'Collections',
      slug: 'singles',
      ownPage: true,
      ...singles,
      // A set no album page covers - worth a search result.
      indexable: true,
    },
    {
      name: 'Midnight Sun + Girls Trip',
      group: 'Collections',
      slug: 'midnight-sun-plus-girls-trip',
      ...girlsTripEdition,
      themeKey: REMIX_ALBUM,
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
      themeKey: 'Honor The Light',
      // Her Christmas songs, which no album page lists together.
      indexable: true,
    },
  ],
};
