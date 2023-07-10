import React, { useState } from "react";
import { toast } from "react-hot-toast";
import "./AddQuestion.scss";
import { RiImageAddLine } from "react-icons/ri";
import { FiPlus } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";
import { Button, Modal } from 'antd';
import MathKeyboard from "../../MathKeyboard/MathKeyboard";

const QuizCreator = ({ updateParentArray }) => {
  const [questions, setQuestions] = useState([]);
  const [showAnswerDetail, setShowAnswerDetail] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const[symbols,setSymbols]=useState([])

  // const updateSymbols =(value,questionIndex)=>{
  //  setSymbols(value)
  //  let x=""
  //  value.forEach(element => {
  //     x +=element
  //  });
  //  console.log(x)
  //  const updatedQuestions = questions.map((question, index) => {
  //   if (index === questionIndex) {
  //     return { ...question, text: x };
  //   } 
  //   return question;
      
  // });
  // console.log(updatedQuestions)

  // setQuestions(updatedQuestions);
  // };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const addQuestion = () => {
    const newQuestion = {
      text: "",
      type: "multichoice",
      image: "",
      answerdetail: "",
      options: [
        { id: 1, text: "", image: "", correct: false },
        { id: 2, text: "", image: "", correct: false },
        { id: 3, text: "", image: "", correct: false },
      ],
    };
    setQuestions([...questions, newQuestion]);
  };
  const handleCancleQuestion = (questionIndex) => {
    const updatedQuestions = questions?.filter(
      (_, index) => index !== questionIndex
    );
    setQuestions(updatedQuestions);
  };


  const handleQuestionTextChange = (e, questionIndex) => {
    const updatedQuestions = questions.map((question, index) => {
      if (index === questionIndex) {
        return { ...question, text: e.target.value };
      } 
      return question;
        
    });
    console.log(symbols)

    setQuestions(updatedQuestions);
  };

  const handleQuestionImageChange = (e, questionIndex) => {
    const updatedQuestions = questions.map((question, index) => {
      if (index === questionIndex) {
        return { ...question, image: e.target.files[0] };
      }
      return question;
    });
    setQuestions(updatedQuestions);
  };

  const handleOptionTextChange = (e, questionIndex, optionIndex) => {
    const updatedQuestions = questions.map((question, index) => {
      if (index === questionIndex) {
        const updatedOptions = question.options.map((option, optIndex) => {
          if (optIndex === optionIndex) {
            return { ...option, text: e.target.value };
          }
          return option;
        });
        return { ...question, options: updatedOptions };
      }
      return question;
    });
    setQuestions(updatedQuestions);
  };
  const handleAnswerExplanationTextChange = (e, questionIndex) => {
    const updatedQuestions = questions.map((question, index) => {
      if (index === questionIndex) {
        return {...question,answerdetail: e.target.value };
      }
      return question;
    });
    setQuestions(updatedQuestions);
    console.log(updatedQuestions)
  };

  const handleOptionImageChange = (e, questionIndex, optionIndex) => {
    const updatedQuestions = questions.map((question, index) => {
      if (index === questionIndex) {
        const updatedOptions = question.options.map((option, optIndex) => {
          if (optIndex === optionIndex) {
            return { ...option, image: e.target.files[0] };
          }
          return option;
        });
        return { ...question, options: updatedOptions };
      }
      return question;
    });
    setQuestions(updatedQuestions);
  };

  const handleOptionCheck = (e, questionIndex, optionIndex) => {
    const updatedQuestions = questions.map((question, index) => {
      if (index === questionIndex) {
        const updatedOptions = question.options.map((option, optIndex) => {
          if (optIndex === optionIndex) {
            return { ...option, correct: e.target.checked };
          }
          return option;
        });
        return { ...question, options: updatedOptions };
      }
      return question;
    });
    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = questions.map((question, index) => {
      if (index === questionIndex && question.options.length < 5) {
        const newOption = {
          id: Date.now(),
          text: "",
          image: "",
          correct: false,
        };
        return { ...question, options: [...question.options, newOption] };
      }
      return question;
    });
    setQuestions(updatedQuestions);
  };

  const removeOption = (questionIndex, optionId) => {
    const updatedQuestions = questions.map((question, index) => {
      if (index === questionIndex) {
        const updatedOptions = question?.options?.filter(
          (option) => option.id !== optionId
        );
        return { ...question, options: updatedOptions };
      }
      return question;
    });
    setQuestions(updatedQuestions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (questions.length == 0) {
      toast.error("Enter questions first");
      return;
    }
    // Handle form submission and data storage here
    updateParentArray(questions);
    console.log(questions); // Array containing all the question data
    setQuestions([]);
  };

  const validateForm = () => {
    for (const question of questions) {
      if (
        question.text.trim() === "" ||
        question.options.some((option) => option.text.trim() === "")
      ) {
        return false;
      }
    }
    return true;
  };

  return (
    <div className="quiz-creator">
      <h2 className="quiz-creator-h2">Create Quiz</h2>
      <form className="add-form" onSubmit={handleSubmit}>
        {questions.map((question, questionIndex) => (
          <div key={questionIndex}>
            <div className="question-main">
              <div className="question-image">
                <label>
                  <RiImageAddLine className="icon" />
                  <input
                    style={{ visibility: "hidden" }}
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleQuestionImageChange(e, questionIndex)
                    }
                  />
                </label>
                {question.image && (
                  <img
                    src={URL.createObjectURL(question.image)}
                    alt="Question"
                    width="90px"
                    height="85px"
                  />
                )}
              </div>

              <div className="question-text">
              {/* <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <Modal width={600} title="Math Expressions" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <MathKeyboard updateSymbols ={(value)=>updateSymbols(value,questionIndex)} />
      </Modal> */}
                <textarea
                  type="text"
                  placeholder="Enter Question"
                  value={question.text}
                  onChange={(e) => handleQuestionTextChange(e, questionIndex)}
                  required
                />
              </div>
              <button
                className="close-question-btn"
                onClick={() => handleCancleQuestion(questionIndex)}
              >
                <MdOutlineCancel />
              </button>
            </div>
            <div className="main-options">
              {question.options.map((option, optionIndex) => (
                <div className="options-card" key={option.id}>
                  <div className="option-image">
                    <label>
                      <RiImageAddLine className="icon" />
                      <input
                        style={{ visibility: "hidden" }}
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleOptionImageChange(e, questionIndex, optionIndex)
                        }
                      />
                    </label>
                    <img
                      src={option.image && URL.createObjectURL(option.image)}
                    />
                  </div>
                   
                  <textarea
                    placeholder="Enter Option"
                    type="text"
                    value={option.text}
                    onChange={(e) =>
                      handleOptionTextChange(e, questionIndex, optionIndex)
                    }
                    required
                  />

                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={option.correct || false}
                      onChange={(e) =>
                        handleOptionCheck(e, questionIndex, optionIndex)
                      }
                    />
                    <span className="checkmark"></span>
                    Correct Option
                  </label>
                  {optionIndex > 1 && (
                    <button
                      className="remove-btn"
                      type="button"
                      onClick={() => removeOption(questionIndex, option.id)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

              {question.options.length < 5 && (
                <button
                  type="button"
                  className="add-option-btn"
                  onClick={() => addOption(questionIndex)}
                >
                  <FiPlus />
                </button>
              )}
            </div>
            <div className="answer-detail">
              <textarea
                type="text"
                placeholder="Answer Explanation"
                value={question.answerdetail}
                onChange={(e) =>
                  handleAnswerExplanationTextChange(e, questionIndex)
                }
              />
            </div>
          </div>
        ))}
        <div className="end-buttons">
          <button type="button" className="add-button" onClick={addQuestion}>
            Add Question
          </button>
          <button
            className="submit-button"
            type="submit"
            disabled={!validateForm()}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizCreator;
