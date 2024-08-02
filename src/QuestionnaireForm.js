import React, { useState } from "react";
import "./QuestionnaireForm.css";

const sampleJSON = `
[
  {
    "questionId": "q1",
    "question": {
      "title": "Which of the following are programming languages?",
      "note": "(Select all that apply)",
      "type": "choices",
      "options": ["Python", "HTML", "JavaScript", "CSS"],
      "correctAnswer": ["Python", "JavaScript"]
    },
    "required": true
  },
  {
    "questionId": "q2",
    "question": {
      "title": "Is Earth the third planet from the sun?",
      "note": "",
      "type": "boolean",
      "correctAnswer": "true"
    },
    "required": true
  },
  {
    "questionId": "q3",
    "question": {
      "title": "Which country is known as the Land of the Rising Sun?",
      "note": "",
      "type": "choice",
      "options": ["China", "Japan", "South Korea", "Thailand"],
      "correctAnswer": "Japan"
    },
    "required": true
  }
]
`;

const QuestionnaireForm = () => {
  const [jsonInput, setJsonInput] = useState(sampleJSON);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleJsonChange = (event) => {
    setJsonInput(event.target.value);
  };

  const handleJsonSubmit = () => {
    try {
      const parsedQuestions = JSON.parse(jsonInput);
      setQuestions(parsedQuestions);
      setSubmitted(false); // Reset the form submission state
      setResponses({}); // Reset responses
    } catch (error) {
      alert("Invalid JSON input. Please provide a valid JSON array.");
    }
  };

  const handleChange = (event, questionId) => {
    const { name, value, type, checked } = event.target;
    setResponses((prevResponses) => {
      if (type === "checkbox") {
        const prevAnswers = prevResponses[questionId] || [];
        if (checked) {
          return { ...prevResponses, [questionId]: [...prevAnswers, value] };
        } else {
          return {
            ...prevResponses,
            [questionId]: prevAnswers.filter((answer) => answer !== value),
          };
        }
      } else {
        return { ...prevResponses, [questionId]: value };
      }
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case "choices":
        return question.options.map((option, index) => (
          <div key={index} className="option-container">
            <label>
              <input
                type="checkbox"
                name={question.id}
                value={option}
                onChange={(e) => handleChange(e, question.id)}
              />
              <span>{option}</span>
            </label>
          </div>
        ));
      case "boolean":
        return ["true", "false"].map((option, index) => (
          <div key={index} className="option-container">
            <label>
              <input
                type="radio"
                name={question.id}
                value={option}
                onChange={(e) => handleChange(e, question.id)}
              />
              <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
            </label>
          </div>
        ));
      case "choice":
        return question.options.map((option, index) => (
          <div key={index} className="option-container">
            <label>
              <input
                type="radio"
                name={question.id}
                value={option}
                onChange={(e) => handleChange(e, question.id)}
              />
              <span>{option}</span>
            </label>
          </div>
        ));
      default:
        return null;
    }
  };

  const renderResponseMessage = () => {
    return questions.map((question) => {
      const userAnswer = responses[question.questionId];
      const correctAnswer = question.question.correctAnswer;

      let isCorrect;
      if (question.question.type === "choices") {
        isCorrect =
          Array.isArray(userAnswer) &&
          userAnswer.length === correctAnswer.length &&
          userAnswer.every((answer) => correctAnswer.includes(answer));
      } else {
        isCorrect = userAnswer === correctAnswer;
      }

      return (
        <div
          key={question.questionId}
          className={`response-message ${isCorrect ? "success" : "error"}`}
        >
          {question.question.title}:{" "}
          {isCorrect
            ? "Correct"
            : `Incorrect (Correct answer: ${correctAnswer})`}
        </div>
      );
    });
  };

  return (
    <div className="form-container">
      <h2>General Knowledge Quiz</h2>
      <div className="json-input">
        <textarea
          value={jsonInput}
          onChange={handleJsonChange}
          rows="10"
          placeholder="Paste your JSON array here..."
        />
        <button onClick={handleJsonSubmit}>Generate Form</button>
      </div>
      {questions.length > 0 && (
        <form onSubmit={handleSubmit}>
          {questions.map((question) => (
            <div key={question.questionId} className="form-group">
              <label>{question.question.title}</label>
              {renderQuestion(question.question)}
            </div>
          ))}
          <button type="submit">Submit</button>
        </form>
      )}
      {submitted && renderResponseMessage()}
    </div>
  );
};

export default QuestionnaireForm;
