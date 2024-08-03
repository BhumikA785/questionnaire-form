import React, { useState } from "react";
import "./QuestionnaireForm.css";

const sampleJson = `{
  "questions": [
    {
      "order": 1,
      "questionId": "a69ff316-4949-4a84-a6cd-3124fe9eda3b",
      "required": true,
      "question": {
        "title": "Question 1 - Multiple choice Type",
        "note": "sample note",
        "type": "choices",
        "options": ["option 1", "option 2", "option 3", "option 4"]
      }
    },
    {
      "order": 2,
      "questionId": "d51e1e1e-49e9-4bfb-a6cd-5151fe9eda3c",
      "required": true,
      "question": {
        "title": "Question 2 - Boolean type",
        "note": "sample note for boolean",
        "type": "boolean"
      }
    },
    {
      "order": 3,
      "questionId": "4059e035-93b0-4dd5-bb69-8006b999dd89",
      "required": true,
      "question": {
        "title": "Question 3 - Single choice ",
        "note": "sample note",
        "type": "choice",
        "options": ["choice 1", "choice 2", "choice 3"]
      }
    }
  ],
  "title": "Questionnaire 1"
}`;

const QuestionnaireForm = () => {
  const [jsonInput, setJsonInput] = useState(sampleJson);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submittedAnswers, setSubmittedAnswers] = useState([]);

  const handleJsonInput = (e) => {
    setJsonInput(e.target.value);
  };

  const loadQuestions = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      setQuestions(parsedJson.questions);
    } catch (error) {
      alert("Invalid JSON format");
    }
  };

  const handleCheckboxChange = (questionId, value) => {
    setAnswers((prevAnswers) => {
      const currentAnswers = prevAnswers[questionId] || [];
      if (currentAnswers.includes(value)) {
        return {
          ...prevAnswers,
          [questionId]: currentAnswers.filter((answer) => answer !== value),
        };
      } else {
        return {
          ...prevAnswers,
          [questionId]: [...currentAnswers, value],
        };
      }
    });
  };

  const handleRadioChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const output = questions.map((question) => ({
      question: question.question.title,
      answer: answers[question.questionId] || "",
    }));
    setSubmittedAnswers(output);
  };

  const renderQuestion = (question) => {
    switch (question.question.type) {
      case "choices":
        return (
          <div key={question.questionId} className="question-block">
            <label>{question.question.title}</label>
            <p>{question.question.note}</p>
            {question.question.options.map((option) => (
              <div key={option}>
                <input
                  type="checkbox"
                  name={`question-${question.questionId}`}
                  value={option}
                  onChange={() =>
                    handleCheckboxChange(question.questionId, option)
                  }
                  checked={
                    answers[question.questionId]?.includes(option) || false
                  }
                />
                <label>{option}</label>
              </div>
            ))}
          </div>
        );
      case "choice":
        return (
          <div key={question.questionId} className="question-block">
            <label>{question.question.title}</label>
            <p>{question.question.note}</p>
            {question.question.options.map((option) => (
              <div key={option}>
                <input
                  type="radio"
                  name={`question-${question.questionId}`}
                  value={option}
                  onChange={() =>
                    handleRadioChange(question.questionId, option)
                  }
                  checked={answers[question.questionId] === option}
                />
                <label>{option}</label>
              </div>
            ))}
          </div>
        );
      case "boolean":
        return (
          <div key={question.questionId} className="question-block">
            <label>{question.question.title}</label>
            <p>{question.question.note}</p>
            <div>
              <input
                type="radio"
                name={`question-${question.questionId}`}
                value="true"
                onChange={() => handleRadioChange(question.questionId, "true")}
                checked={answers[question.questionId] === "true"}
              />
              <label>True</label>
            </div>
            <div>
              <input
                type="radio"
                name={`question-${question.questionId}`}
                value="false"
                onChange={() => handleRadioChange(question.questionId, "false")}
                checked={answers[question.questionId] === "false"}
              />
              <label>False</label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="questionnaire-form-container">
      <textarea
        value={jsonInput}
        onChange={handleJsonInput}
        placeholder="Enter JSON here"
      />
      <button onClick={loadQuestions}>Load Questions</button>
      <form onSubmit={handleSubmit}>
        {questions.map((question) => renderQuestion(question))}
        <button type="submit">Submit</button>
      </form>

      {submittedAnswers.length > 0 && (
        <div className="submitted-answers">
          <h2>Submitted Answers:</h2>
          <ul>
            {submittedAnswers.map(({ question, answer }, index) => (
              <li key={index}>
                <strong>{question}:</strong>{" "}
                {Array.isArray(answer) ? answer.join(", ") : answer}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuestionnaireForm;
