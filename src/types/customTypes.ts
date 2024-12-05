export type Result = {
  page: string;
  _embedded: string;
  _links: string;
};

export type Attraction = {
  name: string;
  id: string;
  images: Images[];
  classifications: Classifications[];
  externalLinks: ExternalLinks;
};

export type ExternalLinks = {
  facebook?: { url: string }[];
  instagram?: { url: string }[];
  homepage?: { url: string }[];
};

export type Classifications = {
  genre: Genre;
  segment: Segment;
  subGenre: subGenre;
};

export type Genre = {
  id: string;
  name: string;
};

export type Segment = {
  id: string;
  name: string;
};

export type subGenre = {
  id: string;
  name: string;
};

export type Event = {
  name: string;
  id: string;
  images: Images[];
  dates: Dates;
  _embedded: Embedded;
};

export type Embedded = {
  attractions: string;
  venues: Venues[];
};

export type Venues = {
  address: Address;
  images: string[];
  name: string;
  parkingDetail: string;
  city: City;
};

export type Address = {
  line1: string;
};

export type City = {
  name: string;
};

export type Images = {
  fallback: boolean;
  height: number;
  ratio: string;
  url: string;
  width: number;
};

export type Dates = {
  start: Start;
  timezone: string;
};

export type Start = {
  localDate: string;
  localTime: string;
};

export type UserType = {
  email: string;
  uid: string;
  name: string;
  favorites?: string[];
  imageUrl?: string;
};
