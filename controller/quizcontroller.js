import { QuizModule } from "../model/quizmodel.js";
import { Dashboard } from "../model/dashboardmodel.js";
import { Enrollment } from "../model/enrollmentmodel.js";
export let quiz=(req,res)=>{
    let mid=req.params.mid;
    return res.render("addquiz",{mid})
}

export let addquiz=async (req,res) => {
    const { name, options, answer, mid } = req.body;

  try {
    await QuizModule.create({
      name,
      options: Array.isArray(options) ? options : [options],
      answer,
      mid,
    });

    res.redirect(`/quiz/${mid}`); // or wherever you want to redirect
  } catch (err) {
    console.error("Error adding quiz:", err);
    res.status(500).send("Internal Server Error");
  }
}

export let viewQuiz = async (req,res)=>{

  let mid = req.params.mid
  let email = req.cookies.email

  let emailCheck = await Enrollment.find({email})

  console.log("emailcheck is ...", emailCheck.length);

  if (emailCheck.length > 0) {
    let quiz = await QuizModule.find({ mid })

  // console.log("Student quiz:", quiz)
  res.render("attemptquiz",{ quiz, mid })
  }else{
     res.redirect("/enrollcourse")
  }
  

  

}

export const manageQuiz = async (req,res)=>{

  let mid = req.params.mid

  let quiz = await QuizModule.find({ mid })

  console.log("Admin quiz:", quiz)

  res.render("viewquiz",{ quiz, mid })

}

export const editQuiz = async(req,res)=>{
    let qid=req.params.qid
    let quiz=await QuizModule.findOne({qid})

    res.render("editquiz",{quiz})
}

export const updateQuiz = async(req,res)=>{
    let qid=req.params.qid
    let {name,options,answer}=req.body

    await QuizModule.updateOne(
        {qid},
        {
            name,
            options:Array.isArray(options)?options:[options],
            answer
        }
    )

    res.redirect("/manage-courses")
}

export const deleteQuiz = async(req,res)=>{
    let qid=req.params.qid

    await QuizModule.deleteOne({qid})

    return res.redirect("/manage-courses")
}

export let checkAnswer=async(req,res)=>{
  let answers=req.body.answers
  let mid=req.params.mid
  let quiz=await QuizModule.find({mid})
  let marks=0
  for(let q of quiz){
    if(answers[q._id]==q.answer){
      marks++
    }
  }
  let name=req.cookies.user
  let e=await Enrollment.findOne({name})
  let d=await Dashboard.findOne({name,mid})
  if(d){
    if(d.attempt=="first"){

    
    await Dashboard.updateOne(
      { name: name, mid: mid }, // filter
      { $set: { marks: marks, attempt: "second" } } // fields to update
    );
  }
  else{
    await Dashboard.updateOne(
      { name: name, mid: mid }, // filter
      { $set: { marks: marks, attempt: "third" } } // fields to update
    );
  }
    
  }else{
    await Dashboard.create({marks,name,mid,eid:e.eid})
  }
  
  
  return res.redirect("/viewdashboard/"+mid)
}