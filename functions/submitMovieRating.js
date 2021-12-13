exports = async function(movie_id, movie_rating) {
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
    exports(112233, 6)
  */
  
  console.log(movie_id);
  console.log(movie_rating);
  
  const collection = context.services.get("mongodb-atlas").db("sep6-db").collection("user_movie_ratings");
  const currentUser = context.user;
  console.log(JSON.stringify(currentUser));
  
  const hasRatings = await collection.findOne({userID: currentUser.id});
  
  if (hasRatings) {
    const existingRating = await collection.findOne( {userID: currentUser.id}, { movieRatings: { $elemMatch: { movieId: movie_id } } } );
    
    if (existingRating.movieRatings) {
      console.log('line 27');
      console.log(JSON.stringify(existingRating));
      await collection.updateOne( { userID: currentUser.id }, { $pull: { movieRatings: { movieId: movie_id } } } ).catch(error => console.error(error));
    } else if (!existingRating.movieRatings) {
      console.log('line 31');
      console.log(JSON.stringify(existingRating));
      await collection.updateOne( { userID: currentUser.id }, { $push: { movieRatings: { movieId: movie_id, movieRating: movie_rating } } } ).catch(error => console.error(error));
    }
  } else if (!hasRatings) {
    console.log('line 36');
    const firstRating = [];
    const obj = {
      movieId: movie_id,
      movieRating: movie_rating
    };
    firstRating.push(obj);
    await collection.insertOne({userID: currentUser.id, movieRatings: firstRating}).catch(error => console.error(error)); 
  }
};