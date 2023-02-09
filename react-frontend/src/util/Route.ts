import { position } from "./Position";

export interface Route{
    id:string;
    title:string;
    startPosition: position;
    endPosition: position;
}