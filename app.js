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
    db = await open({ filename: dbpath, driver: sqlite3.Database });
    app.listen(3001, () => {
      console.log("server running at http://localhost/:3001/players/");
    });
  } catch (e) {
    console.log(`db error ${e.message}`);
    process.exit(1);
  }
};
initializeDbServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

//API to get list of all players in team
app.get("/players/", async (request, response) => {
  const QueryToGetPlayers = `SELECT * FROM cricket_team ORDER BY player_id;`;
  const playersArray = await db.all(QueryToGetPlayers);
  response.send(
    playersArray.map((eachPlayer) =>
      convertDbObjectToResponseObject(eachPlayer)
    )
  );
});

//API to get list of
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { player_name, jersey_number, role } = playerDetails;

  const queryToAddPlayer = `INSERT INTO
 cricket_team (player_name,
  jersey_number,
  role)
 VALUES(${player_name},${jersey_number},${role});`;

  const dbResponse = await db.run(queryToAddPlayer);
  response.send("Player Added to Team");
});

// API getting specific player
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const gettingPlayer = `SELECT * FROM cricket_team WHERE 
    player_id=${playerId};`;

  const dbResponse = await db.get(gettingPlayer);
  response.send(dbResponse);
});

//updating a player
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { player_name, jersey_number, role } = playerDetails;

  const updatePlayer = `
    UPDATE 
    cricket_team
    SET player_name=${player_name},
  jersey_number=${jersey_number},
  role=${role}
  WHERE player_id=${playerId};
    `;
  await db.run(updatePlayer);
  response.send("Player Details Up");
});

//deleting a player

app.delete("/players/:playerId/", async (request, resposne) => {
  const { playerId } = request.params;
  const querryToDelete = `DELETE FROM cricket_team WHERE 
    player_id=${playerId};`;
  await db.run(querryToDelete);
  response.send("Player Removed");
});
module.exports = app;
