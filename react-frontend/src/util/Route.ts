import { position } from "./Position";

export interface Route{
    _id:string;
    title:string;
    startPosition: position;
    endPosition: position;
}