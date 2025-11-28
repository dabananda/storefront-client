import { Product } from "./product";

export interface PaginatedResponse {
  content: Product[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}