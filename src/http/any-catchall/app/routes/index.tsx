import React from "react";
import { useRouteData, Form, usePendingLocation } from "@remix-run/react";
import { useLocation } from "react-router-dom";
import type { IndexData } from "../../data/routes/index";

export function headers() {
  return {
    "cache-control": "max-age=30",
  };
}

export function meta() {
  return {
    title: "Kicks! | Remix + Architect on AWS",
    description: "Demo app showing off Remix and Architect",
  };
}

const COLORS = [
  "red",
  "black",
  "blue",
  "purple",
  "orange",
  "green",
  "yellow",
  "pink",
  "white",
  "brown",
  "grey",
];

export default function Index() {
  let data = useRouteData<IndexData>();

  let location = useLocation();
  let pendingLocation = usePendingLocation();
  let loading = useDelayedBoolean(!!pendingLocation);

  let searchParams = new URLSearchParams(
    pendingLocation?.search || location.search
  );
  let gender = searchParams.get("gender");
  let brands = new Set(searchParams.getAll("brand"));
  let colors = new Set(searchParams.getAll("color"));

  let buttonRef = React.useRef<HTMLButtonElement>(null);
  let sortButtonRef = React.useRef<HTMLButtonElement>(null);

  useScrollToTop();

  return (
    <div className="flex">
      <div>
        <Form
          onChange={() => buttonRef.current?.click()}
          className="w-60 py-4 px-6 h-screen sticky top-0 overflow-y-auto"
        >
          <h1 className="font-bold text-2xl">Remix Kicks!</h1>
          <div>
            Built with{" "}
            <a href="https://remix.run" className="text-blue-500">
              Remix
            </a>
          </div>
          <label
            htmlFor="gender"
            className="mt-8 text-sm block font-bold text-gray-500"
          >
            Gender:
          </label>
          <select
            name="gender"
            id="gender"
            value={gender || undefined}
            onChange={() => "lol we don't need you"}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 border rounded-md"
          >
            <option value="">Any</option>
            {data.genders.map((gender) => (
              <option key={gender} value={gender}>
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </option>
            ))}
          </select>

          <div className="mt-6">
            <div className="text-sm block font-bold text-gray-500">
              Brand (OR):
            </div>
            <div className="mt-1">
              {data.brands.map((brand) => (
                <label key={brand} className="flex items-center py-0.5">
                  <input
                    type="checkbox"
                    name="brand"
                    value={brand}
                    id={brand}
                    checked={brands.has(brand)}
                    onChange={() => "lol we don't need you"}
                  />
                  <span className="ml-3 capitalize text-black text-sm">
                    {brand}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm block font-bold text-gray-500">
              Color (AND):
            </div>
            <div className="mt-1">
              {COLORS.map((color) => (
                <label key={color} className="flex items-center py-0.5">
                  <input
                    type="checkbox"
                    name="color"
                    value={color}
                    id={color}
                    checked={colors.has(color)}
                    onChange={() => "lol we don't need you"}
                  />
                  <span className="ml-3 capitalize text-black text-sm">
                    {color}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <input
              type="hidden"
              name="sort"
              value={searchParams.get("sort") || "released_desc"}
            />
            <button ref={buttonRef} type="submit" className="underline mt-2">
              Apply
            </button>
          </div>
        </Form>
      </div>

      <div className="flex-1 relative py-5 pl-8 pr-12">
        <div className="flex justify-between mb-2">
          <div className="text-xl">
            Showing {data.results.items.length} of {data.results.count} results
          </div>
          <Form onChange={() => sortButtonRef.current?.click()}>
            <select
              name="sort"
              value={searchParams.get("sort") || "released_desc"}
              onChange={() => "lol"}
              className="mr-2 pl-2 py-1 pr-8 text-base border-gray-300 border rounded-md"
            >
              <option value="released_desc">Released: Newest</option>
              <option value="released_asc">Released: Oldest</option>
              <option value="price_lowest">Price: Lowest</option>
              <option value="price_highest">Price: Highest</option>
            </select>
            <input
              type="hidden"
              name="gender"
              value={searchParams.get("gender") || undefined}
            />
            {searchParams.getAll("brand").map((brand) => (
              <input key={brand} type="hidden" name="brand" value={brand} />
            ))}
            {searchParams.getAll("color").map((color) => (
              <input key={color} type="hidden" name="color" value={color} />
            ))}
            <button ref={sortButtonRef} type="submit" className="underline">
              Sort
            </button>
          </Form>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
          {data.results.items.map((shoe) => (
            <div key={shoe._id}>
              <div className="flex flex-col text-center">
                <img
                  key={shoe._id}
                  src={shoe.imgUrl}
                  className="object-contain h-64"
                />
                <h2 className="text-gray-900 font-medium text-lg">
                  {shoe.name}
                </h2>
                <Form className="text-gray-600">
                  ${shoe.estimatedMarketValue}{" "}
                  <button className="underline">add to cart</button>
                </Form>
              </div>
            </div>
          ))}
        </div>
        <div
          className={
            loading
              ? "absolute inset-0 bg-white bg-opacity-75 transition"
              : "hidden"
          }
        >
          <svg
            className={
              loading
                ? "animate-spin-slow w-1/5 sticky top-1/4 mx-auto text-gray-900 opacity-50"
                : "hidden"
            }
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M20 4v5h-.582m0 0a8.001 8.001 0 00-15.356 2m15.356-2H15M4 20v-5h.581m0 0a8.003 8.003 0 0015.357-2M4.581 15H9"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function useDelayedBoolean(value: boolean, ms = 100) {
  let [state, setState] = React.useState(value);

  React.useEffect(() => {
    if (value) {
      let id = setTimeout(() => {
        setState(value);
      }, ms);
      return () => clearTimeout(id);
    } else {
      setState(value);
    }
  }, [value]);

  return state;
}

function SuggestibleSelect(props: any) {
  let { value } = props;
  let [state, setState] = React.useState(value);

  let valueRef = React.useRef(value);
  if (value !== valueRef.current) {
    valueRef.current = value;
    setState(value);
  }

  let handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setState(event.target.value);
  };

  return <select {...props} value={state} onChange={handleChange} />;
}

function SuggestibleCheckbox(props: any) {
  let { checked } = props;
  let [state, setState] = React.useState(checked);

  let valueRef = React.useRef(checked);
  if (checked !== valueRef.current) {
    valueRef.current = checked;
    setState(checked);
  }

  let handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState(event.target.checked);
  };

  return (
    <input {...props} type="checkbox" checked={state} onChange={handleChange} />
  );
}

function useScrollToTop() {
  let location = useLocation();

  // TODO: useAction from react-router-dom when it ships instead
  let keys = React.useRef<Set<string> | null>(null);
  if (keys.current === null) {
    keys.current = new Set(location.key);
  }

  React.useEffect(() => {
    if (keys.current?.has(location.key)) {
      return;
    }
    keys.current?.add(location.key);
    window.scrollTo(0, 0);
  }, [location]);
}
