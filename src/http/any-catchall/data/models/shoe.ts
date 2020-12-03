import rawData from "./2020.json";
import sift from "sift";
import { orderBy } from "lodash";

export interface Shoe {
  _id: string;
  sku: string;
  brand: string;
  name: string;
  colorway: string[];
  gender: string;
  retailPrice: number | null;
  releaseDate: string;
  releaseYear: number;
  estimatedMarketValue: number | null;
  link: string;
  imgUrl: string;
  story: string;
}

export interface SearchResult {
  count: number;
  page: number;
  items: Shoe[];
}

const shoes: Shoe[] = (rawData as any)
  .filter(
    sift({
      imgUrl: (url: string) => url.startsWith("https://stockx.imgix.net"),
    })
  )
  .map(
    (shoe: any): Shoe => {
      return {
        ...shoe,
        brand: shoe.brand.toLowerCase(),
        gender: shoe.gender.toLowerCase(),
      };
    }
  );

let brands = Array.from(new Set(shoes.map((shoe) => shoe.brand))).sort();
let getBrands = () => brands;

let genders = Array.from(new Set(shoes.map((shoe) => shoe.gender))).sort();
let getGenders = () => genders;

let search = (searchParams: URLSearchParams): SearchResult => {
  let perPage = 3 * 10;
  let pageSearch = searchParams.get("page");
  let page = pageSearch ? parseInt(pageSearch) : 1;

  let sortField = "releaseDate";
  let sortDirection = "asc";
  let sort = searchParams.get("sort");
  if (sort) {
    let split = sort.split("_");
    sortField = split[0];
    sortDirection = split[1];
  }

  if (Array.from(searchParams.keys()).length === 0) {
    return {
      page: 1,
      count: shoes.length,
      items: shoes.slice(0, perPage),
    };
  }

  let allResults = shoes.filter(
    sift({
      brand(brand: Shoe["brand"]) {
        let brands = searchParams.getAll("brand");
        return brands.length ? brands.includes(brand) : true;
      },
      gender(gender: Shoe["gender"]) {
        let searchGender = searchParams.get("gender");
        return searchGender ? searchGender === gender : true;
      },
      colorway(colorway: string) {
        let colors = searchParams.getAll("color");
        return colors.length
          ? colors.every((color) => colorway.match(new RegExp(color, "i")))
          : true;
      },
    })
  );

  let sorted = orderBy(allResults, [sortField, sortDirection]);
  let start = (page - 1) * perPage;
  let end = start + perPage;
  let paginated = sorted.slice(start, end);

  return {
    count: allResults.length,
    page: page,
    items: paginated,
  };
};

export { getBrands, getGenders, search };
