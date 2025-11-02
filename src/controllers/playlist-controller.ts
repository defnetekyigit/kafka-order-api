import { Request, Response } from "express";
import { playlist, Song } from "../models/playlist-model";

export const getAllSongs = (req: Request, res: Response) => {
  if (playlist.length === 0) {
  res.status(200).json("Playlist is empty.");
  }
  res.status(200).json(playlist);
} 

export const getByIdSong = (req: Request, res: Response) => {
  const song = playlist.find(s => s.id === Number(req.params.id));
  if(song){
    res.status(200).json(song);
  }
  res.status(404).send("Song not found");
};

export const addSong = (req: Request, res: Response) => {
  const { name, singer, duration } = req.body;
  if (!name || !singer) {
    res.status(400).send("Song name and singer are required.");
  }
  const newSong: Song = {
    id: Date.now(),
    name,
    singer,
    duration: duration || "Unknown"
  };

  playlist.push(newSong);
  res.status(201).json(newSong);
};

export const updateSong = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (id == null){
    res.status(400).send("Invalid song ID.");
  }
  const index = playlist.findIndex((s) => s.id === id);
  if (index === -1){
    res.status(404).send("Song not found.");
  }

  const { name, singer, duration } = req.body;
  playlist[index] = {
    ...playlist[index],
    ...(name && { name }),
    ...(singer && { singer }),
    ...(duration && { duration })
  };
  res.status(200).json(playlist[index]);
};

export const removeSong = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (id == null){
    res.status(400).send("Invalid song ID.");
  }
  const index = playlist.findIndex((s) => s.id === id);
  if (index === -1){
    res.status(404).send("Song not found.");
  }
  const deleted = playlist.splice(index, 1);
  res.status(200).send(deleted[0]);

};

export const searchSong = (req: Request, res: Response) => {
  
  const q = (req.query.q as string)?.trim().toLowerCase();
  if (!q){
    res.status(400).json("Search query parameter 'q' is required.");
  }

  const results = playlist.filter((s) =>
    s.name.toLowerCase().includes(q) || s.singer.toLowerCase().includes(q)
  );

  if (results.length === 0){
    res.status(404).send("No songs found for query '${q}'.");
  }
  res.status(200).send(results);
};
