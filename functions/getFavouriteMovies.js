exports = async function(arg) {
  const collection = context.services.get("mongodb-atlas").db("sep6-db").collection("user_favourites");
  const currentUser = context.user;
  console.log(JSON.stringify(currentUser));
  return await collection.findOne({userId: currentUser.id}).then(result => {
    if (result) {
      console.log("success");
    } else {
      console.log("failed");
    }
    return result.favourites;
  }).catch(error => console.error(error));
};