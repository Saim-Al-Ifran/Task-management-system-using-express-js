const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required:true 
    },
    dueDate: {
        type: Date
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    },
    priority:{
        type: String,
        enum: ['low', 'medium', 'high'],
        default:'low'
    },
    category:{
        type: String,
        required:true,
        default: 'unlisted'
    }
 
  });

  const Task = mongoose.model('Task',taskSchema);

  module.exports = Task;