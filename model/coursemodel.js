import mongoose from "mongoose"

import AutoIncrementFactory from 'mongoose-sequence';

// mongoose.connect("mongodb://127.0.0.1:27017/lms").then(()=>console.log("connected")
// ).catch(()=>console.log("not connected")
// )
const AutoIncrement = AutoIncrementFactory(mongoose);

const courseSchema = new mongoose.Schema({
    cid: {
      type: Number,
    },
    name: {
      type: String,
      unique: true,
    },
    duration: {
      type: String,
    },
    fees: {
      type: Number,
    },
    image:{
        type:String
    }
  });
  
  // Apply the plugin to auto-increment 'cid'
  courseSchema.plugin(AutoIncrement, { inc_field: 'cid' });
  courseSchema.pre("remove", async function (next) {
    try {
      // Import Module model dynamically here
      const Module = mongoose.model("Module");
      await Module.deleteMany({ cid: this.cid });
      next();
    } catch (err) {
      next(err);
    }
  });
  
  // Create the model
  export const Course = mongoose.model("Course", courseSchema);