// Chatbot Message Model
const ChatbotMessageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  response: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const ChatbotMessage = mongoose.model('ChatbotMessage', ChatbotMessageSchema);
