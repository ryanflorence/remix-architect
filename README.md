# Remix Architect Experiment

## Running locally:

```sh
arc sandbox
# in another tab

cd src/http/any-catchall
npm run start
```

Then open up [http://localhost:3333](http://localhost:3333) (not 3334, that's just the asset server).

## Deploying:

First build it:

```sh
cd src/http/any-catchall
npm run build
```

And then deploy it:

```sh
# from the root of the project
arc deploy
```
