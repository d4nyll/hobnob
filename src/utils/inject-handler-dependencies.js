function injectHandlerDependencies(handler, db, handlerToEngineMap, ValidationError) {
  const engine = handlerToEngineMap.get(handler);
  return (req, res) => { handler(req, res, db, engine, ValidationError); };
}

export default injectHandlerDependencies;
