exports = async function(arg) {
  
  /*
    Accessing application's values:
    var x = context.values.get("value_name");

    Accessing a mongodb service:
    var collection = context.services.get("mongodb-atlas").db("dbname").collection("coll_name");
    collection.findOne({ owner_id: context.user.id }).then((doc) => {
      // do something with doc
    });

    To call other named functions:
    var result = context.functions.execute("function_name", arg1, arg2);

    Try running in the console below.
  */
  
  const apiKey = '932ce23b1d215099f52391b9c1fd7226';
  const highRevenueMovies = context.services.get("mongodb-atlas").db("sep6-db").collection("high_revenue_movies");
  
  await highRevenueMovies.deleteMany({}).then(result => {
    console.log(`Deleted ${result.deletedCount} item(s).`);
  });
  
  const currentYear = new Date().getFullYear();
  const yearEnd = currentYear - 10;
  
  let movieList = [];
  let yearStart = currentYear;
  
  async function fetchMovies(year) {
    const response = await context.http.get({ url: `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&primary_release_year=${year}&sort_by=revenue.desc` });
    // The response body is a BSON.Binary object. Parse it and return.
    const obj = EJSON.parse(response.body.text());
    await highRevenueMovies.insertMany(obj.results);
  }
  
  while (yearStart > yearEnd) {
    try {
      await fetchMovies(yearStart);
      yearStart--;
    }
    catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
  
  const movieDetails = context.services.get("mongodb-atlas").db("sep6-db").collection("high_revenue_movie_details");
  
  await movieDetails.deleteMany({}).then(result => {
    console.log(`Deleted ${result.deletedCount} item(s).`);
  });
  
  let dataCollection = await highRevenueMovies.find().toArray();
  
  async function fetchMovie(id) {
    const response = await context.http.get({ url: `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}` });
    // The response body is a BSON.Binary object. Parse it and return.
    const obj = EJSON.parse(response.body.text());
    await movieDetails.insertOne(obj);
  }
  
  for (let i = 0; i < dataCollection.length; i++) {
    try {
      await fetchMovie(dataCollection[i].id);
    }
    catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
};