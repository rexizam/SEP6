exports = async function(arg) {
  
  const highRevenueMovies = context.services.get("mongodb-atlas").db("sep6-db").collection("high_revenue_movies");
  const movieDetails = context.services.get("mongodb-atlas").db("sep6-db").collection("high_revenue_movie_details");
  
  await movieDetails.deleteMany({}).then(result => {
    console.log(`Deleted ${result.deletedCount} item(s).`);
  });
  
  return await highRevenueMovies.find().toArray();
};