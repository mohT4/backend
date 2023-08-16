class appiFeatures {
  constructor(queryObject, query) {
    this.queryObject = queryObject;
    this.query = query;
  }

  filter() {
    const queryString = { ...this.queryObject };
    const excludeFields = ['sort', 'fields', 'limit', 'page'];

    excludeFields.forEach((e) => delete queryString[e]);
    let queryStrg = JSON.stringify(queryString);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStrg));
    return this;
  }

  sort() {
    if (this.queryObject.sort) {
      const sortBy = this.queryObject.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  fields() {
    if (this.queryObject.fields) {
      const fields = this.queryObject.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  limit() {
    if (this.queryObject.limit) {
      const page = this.queryObject.page * 1 || 1;
      const limit = this.queryObject.limit * 1 || 1;
      const skip = limit * (page - 1);

      this.query = this.query.skip(skip).limit(limit);
    }
    return this;
  }
}

module.exports = appiFeatures;
