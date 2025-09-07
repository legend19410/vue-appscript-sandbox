function applyMiddlewares(controller, endpoint, middlewares) {
  return function wrappedController(paramsJson) {
    let index = -1;

    function dispatch(i, currentParams) {
      if (i <= index) throw new Error("next() called multiple times");
      index = i;

      let fn = middlewares[i];
      if (i === middlewares.length) {
        fn = controller; // run final controller
      }

      if (!fn) return; // nothing left
      return fn(currentParams, (nextParams) => dispatch(i + 1, nextParams));
    }

    const params = JSON.parse(paramsJson)
    params['endpoint'] = endpoint

    return dispatch(0, params);
  };
}



