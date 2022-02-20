class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1A Filtering
    let queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    let query = {};
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B Advanced filtering
    for (let a of Object.entries(queryObj)) {
      console.log('queryObj', typeof a[0]);

      switch (a[0]) {
        case 'region':
          query[a[0]] = a[1];
          break;

        case 'country':
          query[a[0]] = a[1];
          break;

        case 'city':
          query[a[0]] = a[1];
          break;

        case 'company':
          query[a[0]] = a[1];
          break;

        case 'interest':
          query[a[0]] = a[1];
          break;

        default:
          query[a[0]] = new RegExp(a[1], 'i');
          break;
      }
    }

    console.log('query', query);
    queryObj = query;
    /* let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|text)\b/g, (match) => `$${match}`);

    this.query.find(JSON.parse(queryStr)); */
    this.query.find(queryObj);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
