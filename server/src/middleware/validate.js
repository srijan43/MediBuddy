function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    if (!result.success) {
      return next(
        Object.assign(new Error('Validation error'), {
          statusCode: 400,
          details: result.error.flatten(),
        })
      );
    }
    req.validated = result.data;
    return next();
  };
}

module.exports = { validate };

