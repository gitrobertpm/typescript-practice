/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from 'express';
import * as ItemService from './items.service';
import { BaseItem, Item } from './item.interface';

/**
 * Router Definition
 */

export const itemsRouter = express.Router();

/**
 * Controller Definitions
 */

// Async Try/Catch middleware
const atc = (cb: Function) => {
  return async (req: Request, res: Response, next: Function) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      console.error('ATC FUNCTION ERR LOG: ', err);
      next(err);
    }
  }
};

// GET items
itemsRouter.get('/', atc(async (req: Request, res: Response, next: Function) => {
  const items: Item[] = await ItemService.findAll();
  res.status(200).send(JSON.stringify(items, null, 4));
}));

// GET items/:id
itemsRouter.get('/:id', atc(async (req: Request, res: Response, next: Function) => {
  const id: number = parseInt(req.params.id, 10);
  const item: Item = await ItemService.find(id);

  if (item) {
    return res.status(200).send(JSON.stringify(item, null, 4));
  }

  res.status(404).send('Item not found');
}));

// POST items
itemsRouter.post('/', atc(async (req: Request, res: Response, next: Function) => {
  const item: BaseItem = req.body;
  const newItem = await ItemService.create(item);
  res.status(201).json( { itemCreated: newItem });
}));

// PUT items/:id
itemsRouter.put('/:id', atc(async (req: Request, res: Response, next: Function) => {
  const id: number = parseInt(req.params.id, 10);
  const itemUpdate: Item = req.body;
  const existingItem: Item = await ItemService.find(id);

  if (existingItem) {
    const updatedItem = await ItemService.update(id, itemUpdate);
    return res.status(201).json( { itemUpdated: updatedItem });
  }

  const newItem = await ItemService.create(itemUpdate);
  res.status(201).json(newItem);
}));

// DELETE items/:id
itemsRouter.delete('/:id', atc(async (req: Request, res: Response, next: Function) => {
  const id: number = parseInt(req.params.id, 10);
  await ItemService.remove(id);
  res.sendStatus(204);
}));
