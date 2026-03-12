import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 10000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err));

// Schema
const QuestionSchema = new mongoose.Schema({
  question:String,
  answer:String,
  createdAt:{type:Date,default:Date.now}
});

const Question = mongoose.model("Question",QuestionSchema);

// AI route
app.post("/ask",async(req,res)=>{
  try{

    const ai = await openai.chat.completions.create({
      model:"gpt-4o-mini",
      messages:[
        {role:"system",content:"You are a professional automotive mechanic helping diagnose vehicle problems."},
        {role:"user",content:req.body.question}
      ]
    });

    const answer = ai.choices[0].message.content;

    await Question.create({
      question:req.body.question,
      answer
    });

    res.json({answer});

  }catch(err){
    res.status(500).json({error:"AI request failed"});
  }
});

// history
app.get("/history",async(req,res)=>{
  const data = await Question.find().sort({createdAt:-1}).limit(20);
  res.json(data);
});

// frontend
app.use(express.static(path.join(__dirname,"public")));

app.listen(PORT,()=>{
  console.log("Garage Wisdom running on port "+PORT);
});
