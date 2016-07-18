# proc-that
proc(ess)-that - easy extendable etl tool for nodejs written in typescript.

Basically instantiate the `Etl` class and add extractors (which pull data from a datasource), transformers (which process the extracted data) and loaders (they load the results into a sink).

A basic, hypothetic example could be: "Load data from a JSON array, snake_case all properties and store those objects into a mongoDB."

The package is written in `typescript` but can be used in plain javascript as well. 

##### A bunch of badges

[![Build Status](https://travis-ci.org/smartive/proc-that.svg?maxAge=3600)](https://travis-ci.org/smartive/proc-that) [![npm](https://img.shields.io/npm/v/proc-that.svg?maxAge=3600)](https://www.npmjs.com/package/proc-that) [![Coverage status](https://img.shields.io/coveralls/smartive/proc-that.svg?maxAge=3600)](https://coveralls.io/github/smartive/proc-that) [![license](https://img.shields.io/github/license/smartive/proc-that.svg?maxAge=2592000)](https://github.com/smartive/proc-that)

## Usage

```typescript
import {Etl} from 'proc-that';

new Etl()
    .addExtractor(/* class that implements Extractor */)
    .addTransformer(/* class that implements Transformer */)
    .addLoader(/* class that implements Loader */)
    .start()
    .subscribe(progress, error, success);
```

After all objects are extracted, transformed and loaded, the `.start()` observable completes and the process is finished.

Below is a list if extractors and loaders that are already implemented. Feel free to implement your own extractor / transformer / loader and contribute it to this list with a PR.

## Extractors

 Name                           | Description                                      | Link 
--------------------------------|--------------------------------------------------|-------------------------------------------------------
 `proc-that-rest-extractor`     | Extract objects from GET requests                | https://github.com/buehler/proc-that-rest-extractor

## Loaders

 Name                           | Description                                      | Link 
--------------------------------|--------------------------------------------------|-------------------------------------------------------
 `proc-that-elastic-loader`     | Load transformed objects into elasticsearch      | https://github.com/buehler/proc-that-elastic-loader

## Implement your own

To ease up implementing your own extractors / transformers or loaders, just create a new repository and install `proc-that` as a dev-dependency. This package contains the needed definition files for the interfaces you need to create the extensions.