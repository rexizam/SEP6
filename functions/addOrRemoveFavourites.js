exports = async function(favouriteMovies){
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
  
  const collection = context.services.get("mongodb-atlas").db("sep6-db").collection("user_favourites");
  const currentUser = context.user;
  console.log(JSON.stringify(currentUser));
  console.log(favouriteMovies);
  const hasFavourites = await collection.findOne({userId: currentUser.id});
  if (hasFavourites) {
    return await collection.updateOne({userId: currentUser.id}, {$set :{favourites:favouriteMovies}}).catch(error => console.error(error)); 
  } else {
    return await collection.insertOne({userId: currentUser.id, favourites:favouriteMovies}).catch(error => console.error(error)); 
  }
};