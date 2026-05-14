import mongoose from 'mongoose'

const documentSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    status: {
      type: String,
      enum: ['missing', 'requested', 'received'],
      default: 'missing'
    },
    note: {
      type: String,
      trim: true,
      maxlength: 400,
      default: ''
    },
    dueDate: {
      type: String,
      trim: true,
      maxlength: 10,
      default: ''
    },
    required: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

const caseSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    caseType: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    status: {
      type: String,
      enum: ['draft', 'collecting', 'ready', 'submitted'],
      default: 'draft'
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ''
    },
    dueDate: {
      type: String,
      trim: true,
      maxlength: 10,
      default: ''
    },
    documents: {
      type: [documentSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
)

const Case = mongoose.model('Case', caseSchema)

export default Case
