# proc-that [![Build Status](https://travis-ci.org/buehler/proc-that.svg?branch=master)](https://travis-ci.org/buehler/proc-that)
proc(ess)-that - easy extendable etl tool for nodejs written in typescript.

Basically instantiate the `Etl` class and add extractors (which pull data from a datasource), transformers (which process the extracted data) and loaders (they load the results into a sink).

A basic, hypothetic example could be: "Load data from a JSON array, snake_case all properties and store those objects into a mongoDB."

The package is written in `typescript` but can be used in plain javascript as well. 

## Usage

```typescript
import {Etl} from 'proc-that';

new Etl()
    .addExtractor(/* class that implements IExtract */)
    .addTransformer(/* class that implements ITransform */)
    .addLoader(/* class that implements ILoad */)
    .start()
    .then(success, error);
```

When `.start()` is called, all extractors are started and their `.read()` function is called. If the if the result of the function is an array, all elements of the array are written one by one into the buffer. When the buffer receives objects, they are read and then put through the whole chain of transformers. The transformers are called in the order of their adding. All of the `.process(obj)` functions are called as promises. After the object is processed, it is written to the `outputBuffer`. From there, it is passed to all loaders with the `.write(obj)` function.

After all objects are extracted, transformed and loaded, the `.start()` promise resolves and the process is finished.

Below is a list if extractors and loaders that are already implemented. Feel free to implement your own extractor / transformer / loader and contribute it to this list with a PR.

## Extractors

 Name   || Description || Link 
--------||--------------||-----
 `proc-that-rest-extractor` || Extract objects from GET requests || http://google.ch

## Loaders

 Name   || Description || Link 
--------||-------------||------
 `proc-that-elastic-loader` || Load transformed objects into elasticsearch || http://google.ch
