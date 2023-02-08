import { Schema } from '@nestjs/mongoose';
import { Prop, raw, SchemaFactory } from '@nestjs/mongoose/dist';

export type RouteDocument = Route & Document;
@Schema()
export class Route {
  @Prop()
  title: string;

  @Prop(
    raw({
      lat: { type: Number },
      lng: { type: Number },
    }),
  )
  startPosition: { lat: number; lng: number };

  @Prop(
    raw({
      lat: { type: Number },
      lng: { type: Number },
    }),
  )
  endPosition: { lat: number; lng: number };
}

export const RouteSchema = SchemaFactory.createForClass(Route);
