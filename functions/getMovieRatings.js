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
  
  const collection = context.services.get("mongodb-atlas").db("sep6-db").collection("user_movie_ratings");
  const currentUser = context.user;
  console.log(JSON.stringify(currentUser));
  
  return await collection.findOne({userID: currentUser.id}).then(result => {
    if (result) {
      return result.movieRatings;
    } else {
      return [];
    }
  });
};