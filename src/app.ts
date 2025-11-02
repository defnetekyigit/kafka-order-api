import express from "express";
import { playlistsRouter } from  "./routes/playlist-router"
import { setupSwagger } from "./swagger";
import cors from "cors";


const app = express();
app.use(cors());
app.use(express.json());

setupSwagger(app);
app.use("/api/songs", playlistsRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
