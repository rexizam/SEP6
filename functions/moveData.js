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
  
  const sourceCollection = context.services.get("mongodb-atlas").db("sample_mflix").collection("movies");
  const destinationCollection = context.services.get("mongodb-atlas").db("sep6-db").collection("movie_data_src");
  
  let dataToMove = await sourceCollection.find().toArray();
  //console.log(JSON.stringify(dataToMove));
  
  try {
    await destinationCollection.insertMany(dataToMove);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};