const express = require("express");
const app = express();
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
app.use(express.json());
const path = require("path");
const dbpath = path.join(__dirname, "cricketTeam.db");
let db = null;
const initializeDbServer = async () => {
  try {
    const db = open({ filename: dbpath, driver: sqlite3.database });
    app.listen(3000, () => {
      console.log("server running at http://localhost/:3000/players/");
    });
  } catch (e) {
    console.log(`db error ${e.message}`);
    process.exit(1);
  }
};
initializeDbServer();
//API to get list of all players in team
app.get("/players/", async (request, response) => {
  const QueryToGetPlayers = `SELECT * FROM cricket_team ORDER BY player_id;`;
  const players = await db.all(QueryToGetPlayers);
  response.send(players);
});

//API t
