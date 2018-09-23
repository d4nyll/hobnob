function injectHandlerDependencies(
  handler, db, handlerToEngineMap, handlerToValidatorMap, ...remainingArguments
) {
  const engine = handlerToEngineMap.get(handler);
  const validator = handlerToValidatorMap.get(handler);
  return (req, res) => { handler(req, res, db, engine, validator, ...remainingArguments); };
}

export default injectHandlerDependencies;
