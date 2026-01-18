import mongoose, { Schema, Document, Model } from 'mongoose'

export interface INote extends Document {
  videoId: string
  note: string
  createdAt: Date
  updatedAt: Date
}

const NoteSchema: Schema = new Schema(
  {
    videoId: {
      type: String,
      required: [true, 'Video ID is required'],
      index: true,
    },
    note: {
      type: String,
      required: [true, 'Note content is required'],
    },
  },
  {
    timestamps: true,
  }
)

const Note: Model<INote> =
  mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema)

export default Note
