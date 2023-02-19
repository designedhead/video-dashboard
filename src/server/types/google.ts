export type GoogleItem = {
  kind?: string;
  id: string;
  etag?: string;
  selfLink?: string;
  volumeInfo: {
    title: string;
    subtitle: string;
    authors: [string];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    author?: [string];
    pageCount?: number;
    categories?: [string];
    averageRating?: number;
    ratingsCount?: number;
    maturityRating?: string;
    imageLinks?: {
      smallThumbnail?: string;
      thumbnail?: string;
    };
    language?: string;
    saleInfo?: {
      country?: string;
      saleability?: string;
      isEbook?: boolean;
    };
    accessInfo?: {
      country?: string;
      viewability?: string;
      embeddable?: boolean;
      publicDomain?: boolean;
      textToSpeechPermission?: string;
    };
    searchInfo?: {
      textSnippet?: string;
    };
  };
};

export interface GoogleResponse {
  kind: string;
  totalItems: number;
  items: GoogleItem[];
}

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  categories?: [string];
  authors?: [string];
  rating?: number;
  images?: {
    smallThumbnail?: string;
    thumbnail?: string;
  };
  publishedDate?: string;
  pageCount?: number;
  userRead?: boolean;
}
