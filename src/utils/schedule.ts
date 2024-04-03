import cron from "node-cron";

cron.schedule("0 0 0 * * *", async () => {
  console.log("I am running ...");
});
