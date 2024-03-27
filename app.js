const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

const convertObObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};


app.get("/players/", async(request,response=>{
    const a=`
    SELECT 
    *
    FROM
    cricket_team;`;
    const b=db.all(a);
    response.send(map(i)=>convertObObjectToResponseObject(i));
}));

app.post("/players/", async(request,response)=>{
    const details=request.body;
    const{playerName,jerseyNumber,role}=details;
    const api2=`
    INSERT INTO
    cricket_team(player_name,jersey_number,role)
    VALUES
    (
        '${playerName}',
         ${jerseyNumber},
         ${role}
    );`;
    const db3=await db.run(api2);
    response.send("Player Added to Team");

})
