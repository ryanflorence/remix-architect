import { Loader } from "@remix-run/data";
import type { SearchResult } from "../models/shoe";
import { getBrands, getGenders, search } from "../models/shoe";
import { json } from "@remix-run/data";

export interface IndexData {
  brands: string[];
  genders: string[];
  results: SearchResult;
}

let loader = async ({ request }: { request: Request }): Promise<any> => {
  // request.formData()
  let brands = getBrands();
  let genders = getGenders();

  let url = new URL(request.url);

  // Remix should clear this junk out
  if (url.searchParams.get("gender") === "") {
    url.searchParams.delete("gender");
  }

  // let results = search(url.searchParams).slice(0, 20);
  let results = search(url.searchParams);

  return json(
    { brands, genders, results },
    {
      headers: {
        "cache-control": "max-age=30",
      },
    }
  );
};

export { loader };
