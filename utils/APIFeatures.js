class APIFeatures {
  constructor(query, queryString) {
    this.queryString = queryString;
    this.query = query;
  }

  filter() {
    //excluding query object (filtering)
    const queryObj = { ...this.queryString };
    const excludeFileds = ['sort', 'page', 'limit', 'fields'];
    excludeFileds.forEach(el => delete queryObj[el]);
    //advanced filtering
    let queryObjStr = JSON.stringify(queryObj);
    queryObjStr = queryObjStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryObjStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortby = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortby);
    } else {
      this.query = this.query.sort('-numInStock');
    }
    return this;
  }

  pageination() {
    const limit = this.queryString.limit * 1 || 100;
    const page = this.queryString.page * 1 || 1;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  limiting() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // excluding __v from result
    }
    return this;
  }
}
module.exports = APIFeatures;
