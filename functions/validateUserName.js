exports = async function(payload, response) {
  
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
    exports({query: {userName: "rexizam"}})
  */
  
  const collection = context.services.get("mongodb-atlas").db("sep6-db").collection("user_profiles");
  
  const body = EJSON.parse(payload.body.text());
  
  return await collection.findOne({userName: body.username}).then(result => {
    if (result) {
      return "Username taken.";
    } else {
      return "Username available.";
    }
  }).catch((error) => {
    //return error;
    console.log(error);
  });
  
  //return {arg: body};
};