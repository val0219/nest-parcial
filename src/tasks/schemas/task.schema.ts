import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true, strict: false })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  completed: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
