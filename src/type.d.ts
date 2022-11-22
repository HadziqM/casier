export interface AllUser {
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    items: {
      collectionId: string;
      collectionName: string;
      created: string;
      created_at: string;
      field: string;
      id: string;
      money: number;
      updated: string;
      username: string;
    }[];
  }
  