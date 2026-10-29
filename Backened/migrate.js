// One-time migration: test db -> restaurant_menu db
require("dotenv").config();
const mongoose = require("mongoose");

const BASE =
  "mongodb+srv://shaikhhabiba526_db_user:436920@cluster0.qb2ylgh.mongodb.net";

(async () => {
  const src = mongoose.createConnection(`${BASE}/test`, {
    serverSelectionTimeoutMS: 20000,
  });
  await src.asPromise();
  const target = mongoose.createConnection(`${BASE}/restaurant_menu`, {
    serverSelectionTimeoutMS: 20000,
  });
  await target.asPromise();

  for (const col of ["categories", "foods"]) {
    const docs = await src.db.collection(col).find({}).toArray();
    if (docs.length) {
      await target.db.collection(col).insertMany(docs);
    }
    console.log(`${col}: migrated ${docs.length}`);
  }

  const cats = await target.db.collection("categories").find({}).toArray();
  console.log(
    "restaurant_menu categories:",
    cats.map((c) => c.name).join(", ") || "(empty)"
  );

  await src.close();
  await target.close();
  console.log("DONE");
  process.exit(0);
})().catch((e) => {
  console.error("FAIL", e.message);
  process.exit(1);
});
