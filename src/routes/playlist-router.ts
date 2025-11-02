import express from "express";
import * as controller from "../controllers/playlist-controller";

export const playlistsRouter = express.Router();
playlistsRouter.get("/", controller.getAllSongs);
playlistsRouter.get("/search", controller.searchSong);
playlistsRouter.get("/:id", controller.getByIdSong);
playlistsRouter.post("/", controller.addSong);
playlistsRouter.put("/:id", controller.updateSong);
playlistsRouter.delete("/:id", controller.removeSong);

/**
 * @swagger
 * tags:
 *   name: Songs
 *   description: API for managing songs in a playlist
 *
 * components:
 *   schemas:
 *     Song:
 *       type: object
 *       required:
 *         - name
 *         - singer
 *       properties:
 *         id:
 *           type: integer
 *           example: 1730460132001
 *         name:
 *           type: string
 *           example: Shape of You
 *         singer:
 *           type: string
 *           example: Ed Sheeran
 *         duration:
 *           type: string
 *           example: 3:53
 *
 * /api/songs:
 *   get:
 *     summary: Get all songs
 *     tags: [Songs]
 *     responses:
 *       200:
 *         description: List of all songs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Song'
 *   post:
 *     summary: Add a new song
 *     tags: [Songs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Song'
 *     responses:
 *       201:
 *         description: Song added successfully
 *
 * /api/songs/{id}:
 *   get:
 *     summary: Get song by ID
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Song found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 *       404:
 *         description: Song not found
 *   put:
 *     summary: Update an existing song
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Song'
 *     responses:
 *       200:
 *         description: Song updated successfully
 *       404:
 *         description: Song not found
 *   delete:
 *     summary: Delete a song
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Song deleted successfully
 *       404:
 *         description: Song not found
 *
 * /api/songs/search:
 *   get:
 *     summary: Search songs by name or singer
 *     tags: [Songs]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search keyword
 *     responses:
 *       200:
 *         description: Matching songs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Song'
 *       404:
 *         description: No songs found
 */
