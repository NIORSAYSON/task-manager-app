import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  email: string;
  name: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  name: {
    type: String,
    required: true,
    min: 2,
    max: 16,
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
});

const UserModel =
  mongoose.models?.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
