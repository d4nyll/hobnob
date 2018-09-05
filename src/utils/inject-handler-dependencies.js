function injectHandlerDependencies(handler, db) {
  return (req, res) => { handler(req, res, db); };
}

export default injectHandlerDependencies;
